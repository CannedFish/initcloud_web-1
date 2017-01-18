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
import random

LOG = logging.getLogger(__name__)

def make_fake(period = 6, mi = 0, ma = 10):
    """
    Make fake data.Return index.
    """
    return_data = []
    for i in range(0, period - 1):
	return_data.append([i, round(random.uniform(mi, ma),2)])
    return return_data


def get_sample_data(request, meter_name, resource_id, project_id = None):
    """
    Return index of sample data of day & hour.
    """
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
    """
    Handle request to '^/cloud_monitor$'
    """
    LOG.info("--------- I am cloud_monitor list in Cloud_MonitorList ----------")
    queryset = Cloud_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Cloud_MonitorSerializer
    def list(self, request):
	try:
	    LOG.info('------- CLOUD MONITOR ---------')
	    rc = create_rc_manually(request)
	    clouds = nova.server_list(rc, all_tenants = True)[0]
	    return_data = {}
	    for each in clouds:
		#LOG.info(each)
		if each.status != 'ACTIVE':
		    continue
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
		    LOG.info('------------- CPU -------------------')
		    if settings.CLOUD_MONITOR_FAKE:
		        hour_data = make_fake(6, 2, 8)
			day_data = make_fake(24, 2, 8)
		    else:
		        hour_data, day_data = get_sample_data(rc, 'cpu_util', each.id)
		    cpu_data['hour_data'] = hour_data
		    cpu_data['day_data'] = day_data
		    cloud_data['cpu_data'] = cpu_data
		    LOG.info(cloud_data)
		except:
		    cpu_data = {'hour_data': make_fake(6, 2, 8), 'param_02': ['frequency', '3.4'], 'type': 'CPU', 'day_data': make_fake(24, 2, 8), 'param_01': ['kernal_nums', u'1']}
		    cloud_data['cpu_data'] = cpu_data
		    pass
		#LOG.info('------------- MEMORY -----------------')
                memory_data['hour_data'] = make_fake(6, 1, 4)
                memory_data['day_data'] = make_fake(24, 1, 4)
                cloud_data['memroy'] = memory_data
		LOG.info('------------- DISK -----------------------')
		try:
		    if settings.CLOUD_MONITOR_FAKE:
			hour_data = make_fake(6, 1, 4)
			day_data = make_fake(24, 1, 4)
		    else:
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
		    if settings.CLOUD_MONITOR_FAKE:
                        hour_data = make_fake(6, 1, 4)
                        day_data = make_fake(24, 1, 4)
                    else:
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
		try:
		    if settings.CLOUD_MONITOR_FAKE:
                        hour_data = make_fake(6, 0.1, 1.2)
                        day_data = make_fake(24, 0.1, 1.2)
                    else:
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
		    if settings.CLOUD_MONITOR_FAKE:
                        hour_data = make_fake(6, 0.1, 1.2)
                        day_data = make_fake(24, 0.1, 1.2)
                    else:    
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
	except:
	    #traceback.print_exc()
	    return_data = []
	    return Response(return_data)

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
