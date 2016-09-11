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
#from biz.cloud_monitor_detail.models import Cloud_Monitor_Detail 
from biz.cloud_monitor_detail.serializer import Cloud_Monitor_DetailSerializer
from biz.cloud_monitor_detail.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.cloud_utils import create_rc_manually
from cloud.api import ceilometer
from cloud.api import cinder
from django.conf import settings
import traceback

LOG = logging.getLogger(__name__)

def get_sample_data(request, meter_name, resource_id, project_id = None):
    query = [{'field':'resource_id', 'op':'eq', 'value':resource_id}]
    sample_data = ceilometer.sample_list(request, meter_name, query, limit = 145)
    hour_data = []
    for hour in range(0,6):
        try:
            hour_data.append([hour, sample_data[hour].counter_volume])
        except IndexError:
            hour_data.append([hour, 0])
        except:
            hour_data.append([hour, 4])
    return hour_data


class Cloud_Monitor_DetailList(generics.ListAPIView):
    LOG.info("--------- I am cloud_monitor_detail list in Cloud_Monitor_DetailList ----------")

#@require_POST
    def list(self, request):
        LOG.info('--------------- CLOUD MONITOR DETAIL ---------------')
        try:
	    cloud_id = request.GET.get('cloud_id')
	    rc = create_rc_manually(request)
	    return_data = {}
	    resource = ceilometer.resource_get(rc, cloud_id)
            vcpus = resource.metadata['vcpus']
            memory = resource.metadata['memory_mb']
	#LOG.info(resource)
	#-------------------------- CPU -------------------------
	    hour_data = get_sample_data(rc, 'cpu_util', cloud_id)
	    hour_cpu = 0
            for hour in hour_data:
                hour_cpu = hour_cpu + hour[1]
            avg_cpu = hour_cpu/len(hour_data)
            data = {}
	    data['usage'] = avg_cpu
	    data['data'] = hour_data
	    data['logic_kernal'] = vcpus
	    data['basic_frequency'] = settings.CPU_FREQUENCY
	    data['CPU_type'] = settings.CPU_TYPE
	    return_data['cpu'] = data
	    LOG.info(return_data)
	#------------------------- NETWORK ------------------------
	    hour_data = get_sample_data(rc, 'network.incoming.bytes.rate', cloud_id)
            hour_incoming = 0
            for hour in hour_data:
                hour_incoming = hour_incoming + hour[1]
            avg_incoming = hour_incoming/len(hour_data)
            data = {}            
            data['data'] = []
	    data['data'].append({'incoming':hour_data})
            data['ADSL_UP'] = avg_incoming
	    hour_data = get_sample_data(rc, 'network.outgoing.bytes.rate', cloud_id)
            hour_outgoing = 0
            for hour in hour_data:
                hour_outgoing = hour_outgoing + hour[1]
            avg_outgoing = hour_outgoing/len(hour_data)
	    data['data'].append({'outgoing':hour_data})
            data['ADSL_DOWN'] = avg_outgoing
            return_data['network'] = data
	    LOG.info(return_data)
	#------------------------ MEMORY --------------------------
	    hour_data = get_sample_data(rc, 'memory.resident', cloud_id)
	    data = {}
	    data['using'] = hour_data[0][1]
	    data['surplus'] = float(memory) - data['using']
	    data['memory_usage'] = data['using']/float(memory)
	    data['data'] = hour_data
	    return_data['memory'] = data
	    LOG.info(return_data)
	#----------------------- CINDER ---------------------------
	    volumes = cinder.volume_list(rc, {'all_tenants':1})
	    LOG.info(volumes)
	    data = []
	    for each in volumes:
		LOG.info(each.attachments)
		if len(each.attachments) == 0:
		    continue
		if each.attachments[0]['server_id'] == cloud_id:
		    volume_data = {}
		    volume_data['volumn'] = each.size
		    volume_data['name'] = each.name
		    volume_id = each.id
		    hour_data = get_sample_data(rc, 'disk.write.bytes.rate', cloud_id)
		    hour_write = 0
            	    for hour in hour_data:
                	hour_write = hour_write + hour[1]
            	    avg_write = hour_write/len(hour_data)
		    volume_data['write_speed'] = avg_write
		    hour_data = get_sample_data(rc, 'disk.read.bytes.rate', cloud_id)
                    hour_read = 0
                    for hour in hour_data:
                        hour_read = hour_read + hour[1]
                    avg_read = hour_read/len(hour_data)
                    volume_data['read_speed'] = avg_read
		    data.append(volume_data)
	    LOG.info('VOLUMES ISSSSSSSSSSSSSSSSS ' + str(data))
	    return_data['cloud_disk'] = data
	    return_array = []
	    return_array.append(return_data)
	    return Response(return_array)	
        except:
	    trackback.print_exc()
