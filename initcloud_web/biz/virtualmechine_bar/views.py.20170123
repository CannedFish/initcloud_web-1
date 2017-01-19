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
from biz.virtualmechine_bar.models import Virtualmechine_Bar 
from biz.virtualmechine_bar.serializer import Virtualmechine_BarSerializer
from biz.virtualmechine_bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.api import nova
from cloud.api import cinder
from cloud.api import ceilometer
from cloud.api import neutron
from cloud.cloud_utils import create_rc_manually
import traceback
import random
import ipaddress
import cloud.api.storage as storage

LOG = logging.getLogger(__name__)

def make_fake(period = 6, mi = 0, ma = 10):
    """
    Return fake hour data index
    """
    return_data = []
    for i in range(0, period - 1):
        return_data.append([i, round(random.uniform(mi, ma),2)])
    return return_data

def get_sample_data(request, meter_name, resource_id, project_id = None):
    """
    Return avg hour data of sample data
    """
    query = [{'field':'resource_id', 'op':'eq', 'value':resource_id}]
    sample_data = ceilometer.sample_list(request, meter_name, query, limit = 7)
    hour_data = []
    for hour in range(0,6):
        try:
            hour_data.append([hour, sample_data[hour].counter_volume])
        except IndexError:
            hour_data.append([hour, 0])
        except:
            hour_data.append([hour, 4])
    _sum = 0
    for hour in hour_data:
        _sum = _sum + hour[1]
    avg = _sum/len(hour_data)
    return avg


class Virtualmechine_BarList(generics.ListAPIView):
    """
    Handle request to '^virtualmechine_bar/$'
    """
    LOG.info("--------- I am virtualmechine_bar list in Virtualmechine_BarList ----------")
    queryset = Virtualmechine_Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Virtualmechine_BarSerializer
    def list(self, request):
	try:
	    rc = create_rc_manually(request)
	    pan = cinder.volume_list(rc, {'all_tenants':1})
	    cm = nova.server_list(rc, all_tenants=True)[0]
	    est_cm = len(cm)
	    running_cm = 0
	    cloud_allocat_mem = 0
	    cloud_kernel = 0
	    total_ypan = 0
	    try:
		total_ypan = len(pan)
	    except:
		total_ypan = 0
	    write_rate = []
	    read_rate = []
	    cpu_util = []
	    for each in cm:
		if each.status == 'ACTIVE':
		    running_cm = running_cm + 1
	        if settings.CLOUD_MONITOR_FAKE:
		    _sum = 0
    		    for hour in make_fake(6, 1, 4):
        	        _sum = _sum + hour[1]
    		    write = round(_sum/6, 2)
		    _sum = 0
                    for hour in make_fake(6, 1, 4):
                        _sum = _sum + hour[1]
                    read = round(_sum/6, 2)
		    _sum = 0
                    for hour in make_fake(6, 2, 8):
                        _sum = _sum + hour[1]
                    cpu_loadbalance = round(_sum/6, 2)
                else:
		    avg_write = get_sample_data(rc, 'disk.write.bytes.rate', each.id)
                    write_rate.append(avg_write)
		    avg_read = get_sample_data(rc, 'disk.read.bytes.rate', each.id)
                    read_rate.append(avg_read)
		    avg_util = get_sample_data(rc, 'cpu_util', each.id)
                    cpu_util.append(avg_util)
	            write = round(sum(write_rate)/len(write_rate),2)
	            read = round(sum(read_rate)/len(read_rate),2)
	            cpu_loadbalance = round(sum(cpu_util)/len(cpu_util),2)

	    #hypervisors = nova.hypervisor_list(rc)
            #for each in hypervisors:
                #vcpus_used = vcpus_used + each.vcpus_used
            #    vcpus_used = vcpus_used + each.memory_mb
            #LOG.info(vcpus_used)
            total_kernel = nova.hypervisor_stats(rc).vcpus
            total_memory = nova.hypervisor_stats(rc).memory_mb
            cloud_kernel = nova.hypervisor_stats(rc).vcpus_used
            cloud_allocat_mem = nova.hypervisor_stats(rc).memory_mb_used
            total_capacity = nova.hypervisor_stats(rc).local_gb
            float_ip = 0
	    LOG.info("--------------- neutron floating ip -------------------")
            networks = neutron.network_list(rc)
            net_ip = []
            for network in networks:
                #LOG.info(networks)
                if network['router:external'] == True:
                    subnets = network['subnets']
                    for subnet in subnets:
                        pools = subnet['allocation_pools']
                        cidr = subnet['cidr']
                        nets = ipaddress.ip_network(cidr)
                        for net in nets:
                            net_ip.append(net)
                        for pool in pools:
                            start_ip = pool['start'].split('.')
                            end_ip = pool['end'].split('.')
                            ip_count = int(end_ip[3]) - int(start_ip[3]) + (int(end_ip[2]) - int(start_ip[2]))* 255
                            float_ip = float_ip + ip_count
            ports = neutron.port_list(rc)
            used_float_ip = 0
            for port in ports:
                fix = port.fixed_ips[0]
                fix_ip = ipaddress.ip_network(fix['ip_address'])
                #if port.device_owner == 'network:floatingip':
                if fix_ip[0] in net_ip:
                    used_float_ip = used_float_ip + 1
                    #LOG.info(fix['ip_address'])
            LOG.info(used_float_ip)
            unused_float_ip = float_ip - used_float_ip
            LOG.info(unused_float_ip)
	    return_data = []
	    return_data.append({'write':write,'read':read,'cpu_loadbalance':cpu_loadbalance,"total_kernel":total_kernel,'total_memory':total_memory,'cloud_kernel':cloud_kernel,'cloud_allocat_memory':cloud_allocat_mem,
                'established_cloudmechine':est_cm,'running_cloudmechine':running_cm,'total_ypan':total_ypan,'total_capacity':total_capacity,
                'storage':self._get_storage_data(),'empty_float_ip':unused_float_ip,'used_float_ip':used_float_ip})
	    #LOG.info(return_data)
	    return Response(return_data)
	except:
	    trackback.print_exc()
	    return_data = []	
	    return_data.append({'write':5,'read':4,'cpu_loadbalance':3,"total_kernel":16,'total_memory':28422,'cloud_kernel':'4','cloud_allocat_memory':'1024',
                'established_cloudmechine':'2','running_cloudmechine':'2','total_ypan':'1','total_capacity':'99',
                'storage':{'n':[30,70],'h':[40,60],'RAY':[50,50]},'empty_float_ip':'100','used_float_ip':'200'
})
	    return Response(return_data)

    def _byte_2_gbyte(self, val):
        """
        Convert byte to gigabyte
        """
        return round(val/1024.0/1024.0/1024.0)

    def _get_storage_data(self):
        """
        Get data of storage pool
        """
        pool_status = storage.get_pool_status()
        if pool_status['success']:
            ret = {
                'n': [0, 0],
                'h': [0, 0],
                'RAY': [0, 0]
            }
            for pool in pool_status['data']:
                used = self._byte_2_gbyte(pool['used'])
                remain = self._byte_2_gbyte(pool['size']) - used
                if pool['class'] == 'hdd':
                    ret['n'][0] += used
                    ret['n'][1] += remain
                elif pool['class'] == 'ssd':
                    ret['h'][0] += used
                    ret['h'][1] += remain
                elif pool['class'] == 'nvme':
                    ret['RAY'][0] += used
                    ret['RAY'][1] += remain
                else:
                    continue
            return ret
        else:
            LOG.info("Get pool status failed")
            return {'n':[30,70],'h':[40,60],'RAY':[50,50]}

@require_POST
def create_virtualmechine_bar(request):

    try:
        serializer = Virtualmechine_BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Virtualmechine_Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Virtualmechine_Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create virtualmechine_bar for unknown reason.')})



@api_view(["POST"])
def delete_virtualmechine_bars(request):
    ids = request.data.getlist('ids[]')
    Virtualmechine_Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Virtualmechine_Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_virtualmechine_bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- virtualmechine_bar pk is --------" + str(pk))

        virtualmechine_bar = Virtualmechine_Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        virtualmechine_bar.virtualmechine_barname = request.data['virtualmechine_barname']

        LOG.info("dddddddddddd")
        virtualmechine_bar.save()
        #Operation.log(virtualmechine_bar, virtualmechine_bar.name, 'update', udc=virtualmechine_bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Virtualmechine_Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update virtualmechine_bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update virtualmechine_bar for unknown reason.')})


@require_GET
def is_virtualmechine_barname_unique(request):
    virtualmechine_barname = request.GET['virtualmechine_barname']
    LOG.info("virtualmechine_barname is" + str(virtualmechine_barname))
    return Response(not Virtualmechine_Bar.objects.filter(virtualmechine_barname=virtualmechine_barname).exists())
