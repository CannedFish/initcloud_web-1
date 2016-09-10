# -*- coding:utf8 -*-

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
from biz.service_bar.models import Service_Bar 
from biz.service_bar.serializer import Service_BarSerializer
from biz.service_bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.api import nova
from cloud.api import neutron
from cloud.api import cinder
from cloud.api import keystone
from cloud.cloud_utils import create_rc_manually
import traceback
LOG = logging.getLogger(__name__)

def get_service_status(services, customized = None):
    normal_status = 0
    run_status = 0
    error_status = 0
    for each in services:
	if customized is not None and each.binary != customized:
	    continue
	else:
	    LOG.info(each.status)
	    LOG.info(each.state)
	    LOG.info(each.disabled_reason)
            if each.status == 'enabled':
                normal_status = 1
            if each.state == 'up':
                run_status = 1
            if each.disabled_reason is not None:
                error_status = 1
            #LOG.info(each.updated_at)
    return {'error_status':error_status,'normal_status':normal_status,'run_status':run_status}



class Service_BarList(generics.ListAPIView):
    LOG.info("--------- I am service_bar list in Service_BarList ----------")
    queryset = Service_Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Service_BarSerializer
    def list(self, request):
	LOG.info('---------------- SERVICE BAR ----------------------')
        try:
	    rc = create_rc_manually(request)
	    return_data = []
            LOG.info("----------------SERVICE ------------------------")
	    try:
                nova_services = nova.service_list(rc)
                nova_bar = get_service_status(nova_services,'nova-compute')
                nova_bar['run_time'] = '11:11:11'
	        nova_bar['name'] = '计算'
                LOG.info(nova_bar)
	    except:
		nova_bar = {'name':'计算','error_status':1,'normal_status':0,'run_status':0,'run_time':'00:00:00'}
            LOG.info("---------------- NETWORK ----------------------")
	    try:
                run_status = 0
                error_status = 0
                normal_status = 0
                neutron_services = neutron.agent_list(rc)
                for each in neutron_services:
                    if each.binary == 'neutron-l3-agent' or each.binary =='neutron-dhcp-agent':
                        if each.alive == True:
                            normal_status = 1
                        if each.admin_state == 'UP':
                            run_status = 1
                    else:
                        continue
                network_bar = {'name':'网络','error_status':error_status,'normal_status':normal_status,'run_status':run_status,'run_time':'22:33:44'}
            except:
		network_bar = {'name':'网络','error_status':1,'normal_status':0,'run_status':0,'run_time':'00:00:00'}

	    #network_services = neutron.network_list(rc)
	    LOG.info("---------------- CINDER --------------------")
	    try:
                cinder_services = cinder.cinderclient(rc).services.list()
                cinder_bar = get_service_status(cinder_services,'cinder-volume')
                cinder_bar['run_time'] = '30:45:56'
	        cinder_bar['name'] = '云盘'
                LOG.info(cinder_bar)
	    except:
		cinder_bar = {'name':'云盘','error_status':1,'normal_status':0,'run_status':0,'run_time':'00:00:00'}

            LOG.info("---------------- KEYSTONE --------------------")
	    try:
                keystone_services = keystone.keystoneclient(rc,True).services
            #LOG.info(keystone_services.status)
            #LOG.info(keystone_services.state)
            #LOG.info(keystone_services.disabled)
	        users = keystone.user_list(rc)
		if users is not None:
		    keystone_bar = {'name':'认证','error_status':0,'normal_status':1,'run_status':1,'run_time':'22:33:44'}
	    except:
		keystone_bar = {'name':'认证','error_status':1,'normal_status':0,'run_status':0,'run_time':'00:00:00'}	
	 #   LOG.info(users)
	    return_data.append(nova_bar)
	    return_data.append(cinder_bar)
	    return_data.append(network_bar)
	    return_data.append(keystone_bar)
	    return Response(return_data)
        except:
            traceback.print_exc()
        #return Response({'cinder_bar':cinder_bar,'nova_bar':nova_bar,'network_bar':network_bar})
	

@require_POST
def create_service_bar(request):

    try:
        serializer = Service_BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Service_Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Service_Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create service_bar for unknown reason.')})



@api_view(["POST"])
def delete_service_bars(request):
    ids = request.data.getlist('ids[]')
    Service_Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Service_Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_service_bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- service_bar pk is --------" + str(pk))

        service_bar = Service_Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        service_bar.service_barname = request.data['service_barname']

        LOG.info("dddddddddddd")
        service_bar.save()
        #Operation.log(service_bar, service_bar.name, 'update', udc=service_bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Service_Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update service_bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update service_bar for unknown reason.')})


@require_GET
def is_service_barname_unique(request):
    service_barname = request.GET['service_barname']
    LOG.info("service_barname is" + str(service_barname))
    return Response(not Service_Bar.objects.filter(service_barname=service_barname).exists())
