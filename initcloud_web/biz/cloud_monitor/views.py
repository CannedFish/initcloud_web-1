#-*-coding-utf-8-*-

# Author Yang

from datetime import datetime
import logging

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.contrib.auth.models import check_password

from biz.account.settings import QUOTA_ITEM, NotificationLevel
from biz.cloud_monitor.models import Cloud_Monitor 
from biz.cloud_monitor.serializer import Cloud_MonitorSerializer
from biz.cloud_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.api import ceilometer
from cloud.api import nova
from cloud.cloud_utils import create_rc_manually
import traceback
import time
LOG = logging.getLogger(__name__)

def get_sample_data(request, meter_name, resource_id, project_id = None):
    #query = [{'field':'project_id', 'op':'eq', 'value':project_id},{'field':'resource_id', 'op':'eq', 'value':resource_id}]
    query = [{'field':'resource_id', 'op':'eq', 'value':resource_id}]
    sample_data = ceilometer.sample_list(request, meter_name, query, limit = 145)
    #sample_data = ceilometer.sample_list(request, meter_name, query)
    hour_data = []
    day_data = []
    #LOG.info(sample_data)
    for hour in range(0,6):
	try:
            hour_data.append([hour, sample_data[hour].counter_volume])
	except IndexError:
	    hour_data.append([hour, 0])
	except:
	    hour_data.append([hour, 4])
    for day in range(0,24):
        try:
            day_data.append([day, sample_data[day*6].counter_volume])
        except IndexError:
            day_data.append([day, 0])
        except:
            day_data.append([day, 4])
    return hour_data, day_data


class Cloud_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am cloud_monitor list in Cloud_MonitorList ----------")
    queryset = Cloud_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Cloud_MonitorSerializer
    def list(self, request):
	try:
	    LOG.info('------- CLOUD MONITOR ---------')
	    rc = create_rc_manually(request)
	    clouds = nova.server_list(rc, all_tenants = True)[0]
	    #LOG.info(clouds)
	    return_data = {}
	    for each in clouds:
		#LOG.info(each.host_name)
		#LOG.info(each.id)
		cloud_data = {}
		cloud_data['host'] = each.host_name
		cloud_data['cloud_id'] = each.id
		create_time = time.mktime(time.strptime(each.created,"%Y-%m-%dT%H:%M:%SZ")) 
		now_time = time.time()
		running_time = int(now_time - create_time)
		h = running_time/3600
		m = (running_time%3600)/60
		s = running_time%60
		run_time = str(h)+':'+str(m)+':'+str(s)
		cloud_data['run_time'] = run_time 
		#seconds = running_time.seconds
		#LOG.info('running seconds is ' + str(seconds))
		#LOG.info('running time is ' + str(running_time.seconds + (delta.days * 24 * 3600)))
		cpu_data = {'type':'CPU'}
		memory_data = {'type':'memory'}
		disk_data = {'type':'disk'}
		network_data = {'type':'network'}
		try:
	            for resource in ceilometer.resource_list(rc):
		        if each.id == resource.resource_id:
			    vcpus = resource.metadata['vcpus']
			    memory = resource.metadata['memory_mb']
		    cpu_data['param_01'] = ['kernal_nums',vcpus]
		    cpu_data['param_02'] = ['frequency',settings.CPU_FREQUENCY]
		    memory_data['param_01'] = ['memory_size',memory]
		    #type = {'CPU':'cpu_util','disk':['disk.read.bytes.rate','disk.write.bytes.rate'],'network':['network.incoming.bytes.rate','network.outgoing.bytes.rate']}
		    LOG.info('------------- CPU -------------------')
		    hour_data, day_data = get_sample_data(rc, 'cpu_util', each.id)
		    cpu_data['hour_data'] = hour_data
		    cpu_data['day_data'] = day_data
		    cloud_data['cpu_data'] = cpu_data
		except:
		    cpu_data = {'hour_data': [[0, 4.204420403953293], [1, 4.368556181194232], [2, 4.189353720254463], [3, 4.398223993484855], [4, 4.30526596498043], [5, 4.184032574961405]], 'param_02': ['frequency', '3.4Chz'], 'type': 'CPU', 'day_data': [[0, 4.204420403953293], [1, 4.405007143453251], [2, 4.393873677271919], [3, 0.0], [4, 4.259339382474963], [5, 4.2227048530929325], [6, 4.257761402297557], [7, 4.233484680410657], [8, 4.255011197604271], [9, 4.196980241197634], [10, 4.2101951756621565], [11, 4.204958767709467], [12, 4.188707175642681], [13, 4.2591034217953], [14, 4.282692214308851], [15, 4.264245712234308], [16, 4.276876283167301], [17, 4.217156067628315], [18, 4.286759058619735], [19, 4.240803579518715], [20, 4.2938571364163565], [21, 4.231540218165885], [22, 4.245786764267592], [23, 4.290998988476297]], 'param_01': ['kernal_nums', u'1']}
		    cloud_data['cpu_data'] = cpu_data
		    pass
		#LOG.info('------------- MEMORY -----------------')
		#hour_data, day_data = get_sample_data(rc, 'memory.usage', each.id)
                #cpu_data['hour_data'] = hour_data
                #cpu_data['day_data'] = day_data
                memory_data =  {'hour_data': [[0, 4.204420403953293], [1, 4.368556181194232], [2, 4.189353720254463], [3, 4.398223993484855], [4, 4.30526596498043], [5, 4.184032574961405]],  'type': 'memory', 'day_data': [[0, 4.204420403953293], [1, 4.405007143453251], [2, 4.393873677271919], [3, 0.0], [4, 4.259339382474963], [5, 4.2227048530929325], [6, 4.257761402297557], [7, 4.233484680410657], [8, 4.255011197604271], [9, 4.196980241197634], [10, 4.2101951756621565], [11, 4.204958767709467], [12, 4.188707175642681], [13, 4.2591034217953], [14, 4.282692214308851], [15, 4.264245712234308], [16, 4.276876283167301], [17, 4.217156067628315], [18, 4.286759058619735], [19, 4.240803579518715], [20, 4.2938571364163565], [21, 4.231540218165885], [22, 4.245786764267592], [23, 4.290998988476297]], 'param_01': ['memory_size', 512]}
                cloud_data['memroy'] = memory_data
		LOG.info('------------- DISK -----------------------')
		#------------------- read ----------------------------
		try:
		    hour_data, day_data = get_sample_data(rc, 'disk.read.bytes.rate', each.id)
                    disk_data['hour_data'] = []
                    disk_data['day_data'] = []
                    disk_data['param_01'] = []
                    disk_data['param_02'] = []
                    disk_data['hour_data'].append({'read_data':hour_data})
                    disk_data['day_data'].append({'read_data':day_data})
		    sum_hour = 0
                    for hour in hour_data:
		        sum_hour = sum_hour + hour[1]
		    avg_hour = sum_hour/len(hour_data)
		    sum_day = 0
		    for day in day_data:
                        sum_day = sum_day + day[1]
                    avg_day = sum_day/len(day_data)
                    disk_data['param_01'].append({'hour':['read_total',avg_hour]})
                    disk_data['param_01'].append({'day':['read_total',avg_day]})
		    LOG.info('------------- READ -----------------')
		#---------------------- write --------------	
		    hour_data, day_data = get_sample_data(rc, 'disk.write.bytes.rate', each.id)
                    disk_data['hour_data'].append({'write_data':hour_data})
                    disk_data['day_data'].append({'write_data':day_data})
                    sum_hour = 0
                    for hour in hour_data:
                        sum_hour = sum_hour + hour[1]
                    avg_hour = sum_hour/len(hour_data)
                    sum_day = 0
                    for day in day_data:
                        sum_day = sum_day + day[1]
                    avg_day = sum_day/len(day_data)
		    disk_data['param_02'].append({'hour':['write_total',avg_hour]})
                    disk_data['param_02'].append({'day':['write_total',avg_day]})
		    LOG.info('------------- WRITE -----------------')
                    cloud_data['disk_data'] = disk_data
		except:
		    cloud_data['disk_data'] = {'hour_data': [{'read_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0]]}, {'write_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0]]}], 'param_02': [{'hour': ['write_total', 0.0]}, {'day': ['write_total', 0.0]}], 'type': 'disk', 'day_data': [{'read_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0], [6, 0.0], [7, 0.0], [8, 0.0], [9, 0.0], [10, 0.0], [11, 0.0], [12, 0.0], [13, 0.0], [14, 0.0], [15, 0.0], [16, 0.0], [17, 0.0], [18, 0.0], [19, 0.0], [20, 0.0], [21, 0.0], [22, 0.0], [23, 0.0]]}, {'write_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0], [6, 0.0], [7, 0.0], [8, 0.0], [9, 0.0], [10, 0.0], [11, 0.0], [12, 0.0], [13, 0.0], [14, 0.0], [15, 0.0], [16, 0.0], [17, 0.0], [18, 0.0], [19, 0.0], [20, 0.0], [21, 0.0], [22, 0.0], [23, 0.0]]}], 'param_01': [{'hour': ['read_total', 0.0]}, {'day': ['read_total', 0.0]}]}
		    pass
		LOG.info('------------------ NETWORK -----------------------')
		#------------------- income ----------------------------
		try:
                    hour_data, day_data = get_sample_data(rc, 'network.incoming.bytes.rate', each.id)
                    network_data['hour_data'] = []
                    network_data['day_data'] = []
                    network_data['param_01'] = []
                    network_data['param_02'] = []
                    network_data['hour_data'].append({'ADSL_UP_DATA':hour_data})
                    network_data['day_data'].append({'ADSL_UP_DATA':day_data})
                    sum_hour = 0
                    for hour in hour_data:
                        sum_hour = sum_hour + hour[1]
                    avg_hour = sum_hour/len(hour_data)
                    sum_day = 0
                    for day in day_data:
                        sum_day = sum_day + day[1]
                    avg_day = sum_day/len(day_data)
                    network_data['param_01'].append({'hour':['ADSL_UP',avg_hour]})
                    network_data['param_01'].append({'day':['ADSL_UP',avg_day]})
                    #---------------------- write --------------    
                    hour_data, day_data = get_sample_data(rc, 'disk.outgoing.bytes.rate', each.id)
                    network_data['hour_data'].append({'ADSL_DOWN_DATA':hour_data})
                    network_data['day_data'].append({'ADSL_DOWN_DATA':day_data})
                    sum_hour = 0
                    for hour in hour_data:
                        sum_hour = sum_hour + hour[1]
                    avg_hour = sum_hour/len(hour_data)
                    sum_day = 0
                    for day in day_data:
                        sum_day = sum_day + day[1]
                    avg_day = sum_day/len(day_data)
                    network_data['param_02'].append({'hour':['ADSL_DOWN',avg_hour]})
                    network_data['param_02'].append({'day':['ADSL_DOWN',avg_day]})

                    cloud_data['network_data'] = network_data
		except:
		    cloud_data['network_data'] = {'hour_data': [{'ADSL_UP_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]}, {'ADSL_DOWN_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]}], 'param_02': [{'hour': ['ADSL_DOWN', 0]}, {'day': ['ADSL_DOWN', 0]}], 'type': 'network', 'day_data': [{'ADSL_UP_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}, {'ADSL_DOWN_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}], 'param_01': [{'hour': ['ADSL_UP', 0]}, {'day': ['ADSL_UP', 0]}]}
		    pass
		return_data[each.name] = cloud_data
	    return Response(return_data)
		#LOG.info(return_data)
		#sample_data = get_sample_data(rc, 'disk.read.bytes.rate', project_id)
		#sample_data = get_sample_data(rc, 'disk.write.bytes.rate', project_id)
		#sample_data = get_sample_data(rc, 'network.incoming.bytes.rate', project_id)
		#sample_data = get_sample_data(rc, 'network.outgoing.bytes.rate', project_id)
		#for meter in meters:
#        #sample_data = None
#        if sample_data:
 #           prev_date = None
 #           for s in sample_data:
 #               time = s.timestamp
 #               time_ = time.split("T")
 #               real_time = time_[0]

                #real_time = time.replace("T", " ")

                #real_time = s.timestamp
#
#                value = s.counter_volume
#                if prev_date != real_time:
#                    data.append({'date': real_time, "value": value, "volume": value})
#                    prev_date = real_time
#If we do not get any data from ceilometer, then pass fake data to overview.
#        else:
#            data = [{"date":"2016-02-02", "value":5, "volume":7},{'date':"2016-02-03", "value":8, "volume":7}, {'date':"2016-02-05", "value":8, "volume":7},{'date':"2016-02-06", "value":8.211, "volume":7},{'date':"2016-02-07", "value":90.1, "volume":7}, {'date':"2016-02-08", "value":5.68, "volume":7}, {'date':"2016-02-09", "value":7.65, "volume":7}]




        #reverse the list object
 #       data_ = data[::-1]
#
	    #hypers = nova.hypervisor_stats(rc)
	    #LOG.info(hypers.cpu_info)
	    #meter = ceilometer
	    #for each in hypers:
	#	LOG.info(each)
	    #ceilometer
	except:
	    traceback.print_exc()
	    return Response({u'test2': {'network_data': {'hour_data': [{'ADSL_UP_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]}, {'ADSL_DOWN_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]}], 'param_02': [{'hour': ['ADSL_DOWN', 0]}, {'day': ['ADSL_DOWN', 0]}], 'type': 'network', 'day_data': [{'ADSL_UP_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}, {'ADSL_DOWN_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}], 'param_01': [{'hour': ['ADSL_UP', 0]}, {'day': ['ADSL_UP', 0]}]}, 'host': u'localhost', 'disk_data': {'hour_data': [{'read_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0]]}, {'write_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0]]}], 'param_02': [{'hour': ['write_total', 0.0]}, {'day': ['write_total', 0.0]}], 'type': 'disk', 'day_data': [{'read_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}, {'write_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}], 'param_01': [{'hour': ['read_total', 0.0]}, {'day': ['read_total', 0.0]}]}, 'cloud_id': u'6baa642f-529c-4e99-813b-5464b05d5436', 'cpu_data': {'hour_data': [[0, 4.209433560522372], [1, 4.38185458324851], [2, 4.2093578980613175], [3, 4.413223488200711], [4, 4.323602391110132], [5, 4.20569360234738]], 'param_02': ['frequency', '3.4Chz'], 'type': 'CPU', 'day_data': [[0, 4.209433560522372], [1, 4.4283380716550695], [2, 4.432319924138686], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]], 'param_01': ['kernal_nums', u'1']}}, u'kkjjk': {'network_data': {'hour_data': [{'ADSL_UP_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]}, {'ADSL_DOWN_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]}], 'param_02': [{'hour': ['ADSL_DOWN', 0]}, {'day': ['ADSL_DOWN', 0]}], 'type': 'network', 'day_data': [{'ADSL_UP_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}, {'ADSL_DOWN_DATA': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0]]}], 'param_01': [{'hour': ['ADSL_UP', 0]}, {'day': ['ADSL_UP', 0]}]}, 'host': u'localhost', 'disk_data': {'hour_data': [{'read_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0]]}, {'write_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0]]}], 'param_02': [{'hour': ['write_total', 0.0]}, {'day': ['write_total', 0.0]}], 'type': 'disk', 'day_data': [{'read_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0], [6, 0.0], [7, 0.0], [8, 0.0], [9, 0.0], [10, 0.0], [11, 0.0], [12, 0.0], [13, 0.0], [14, 0.0], [15, 0.0], [16, 0.0], [17, 0.0], [18, 0.0], [19, 0.0], [20, 0.0], [21, 0.0], [22, 0.0], [23, 0.0]]}, {'write_data': [[0, 0.0], [1, 0.0], [2, 0.0], [3, 0.0], [4, 0.0], [5, 0.0], [6, 0.0], [7, 0.0], [8, 0.0], [9, 0.0], [10, 0.0], [11, 0.0], [12, 0.0], [13, 0.0], [14, 0.0], [15, 0.0], [16, 0.0], [17, 0.0], [18, 0.0], [19, 0.0], [20, 0.0], [21, 0.0], [22, 0.0], [23, 0.0]]}], 'param_01': [{'hour': ['read_total', 0.0]}, {'day': ['read_total', 0.0]}]}, 'cloud_id': u'9d226256-e401-4b20-9fcb-8a6faaf66292', 'cpu_data': {'hour_data': [[0, 4.204420403953293], [1, 4.368556181194232], [2, 4.189353720254463], [3, 4.398223993484855], [4, 4.30526596498043], [5, 4.184032574961405]], 'param_02': ['frequency', '3.4Chz'], 'type': 'CPU', 'day_data': [[0, 4.204420403953293], [1, 4.405007143453251], [2, 4.393873677271919], [3, 0.0], [4, 4.259339382474963], [5, 4.2227048530929325], [6, 4.257761402297557], [7, 4.233484680410657], [8, 4.255011197604271], [9, 4.196980241197634], [10, 4.2101951756621565], [11, 4.204958767709467], [12, 4.188707175642681], [13, 4.2591034217953], [14, 4.282692214308851], [15, 4.264245712234308], [16, 4.276876283167301], [17, 4.217156067628315], [18, 4.286759058619735], [19, 4.240803579518715], [20, 4.2938571364163565], [21, 4.231540218165885], [22, 4.245786764267592], [23, 4.290998988476297]], 'param_01': ['kernal_nums', u'1']}}})

@require_POST
def create_cloud_monitor(request):

    try:
        serializer = Cloud_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Cloud_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Cloud_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create cloud_monitor for unknown reason.')})



@api_view(["POST"])
def delete_cloud_monitors(request):
    ids = request.data.getlist('ids[]')
    Cloud_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Cloud_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_cloud_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- cloud_monitor pk is --------" + str(pk))

        cloud_monitor = Cloud_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        cloud_monitor.cloud_monitorname = request.data['cloud_monitorname']

        LOG.info("dddddddddddd")
        cloud_monitor.save()
        #Operation.log(cloud_monitor, cloud_monitor.name, 'update', udc=cloud_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Cloud_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update cloud_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update cloud_monitor for unknown reason.')})


@require_GET
def is_cloud_monitorname_unique(request):
    cloud_monitorname = request.GET['cloud_monitorname']
    LOG.info("cloud_monitorname is" + str(cloud_monitorname))
    return Response(not Cloud_Monitor.objects.filter(cloud_monitorname=cloud_monitorname).exists())
