#-*-coding:utf8 -*-


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
from biz.network_bar_loadbanlance.models import Network_Bar_Loadbanlance 
from biz.network_bar_loadbanlance.serializer import Network_Bar_LoadbanlanceSerializer
from biz.network_bar_loadbanlance.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.cloud_utils import create_rc_manually
from cloud.api import lbaas
from cloud.api import neutron
import traceback
LOG = logging.getLogger(__name__)

class Network_Bar_LoadbanlanceList(generics.ListAPIView):
    """
    Handle request to '^network_bar_loadbanlance/$'
    """
    LOG.info("--------- I am network_bar_loadbanlance list in Network_Bar_LoadbanlanceList ----------")
    queryset = Network_Bar_Loadbanlance.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Network_Bar_LoadbanlanceSerializer
    def list(self, request):
	try:
	    rc = create_rc_manually(request)
	    pool_count = 0
	    vip_count = 0
	    for pool in lbaas.pool_list(rc):
		pool_count = pool_count + 1
		if pool.vip_id is not None:
		    vip_count = vip_count + 1
	    LOG.info('pool count is' + str(pool_count))
	    LOG.info('vip count is' + str(vip_count))
	    data = {'lb_pool_num':pool_count,'lb_virtualip_num':vip_count};
            #data = {'lb_pool_num':"1",'lb_virtualip_num': "2"};
	    return_data = []
	    return_data.append(data)
	    return Response(return_data)
	except:
	    traceback.print_exc()


@require_POST
def create_network_bar_loadbanlance(request):

    try:
        serializer = Network_Bar_LoadbanlanceSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Network_Bar_Loadbanlance is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Network_Bar_Loadbanlance data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create network_bar_loadbanlance for unknown reason.')})



@api_view(["POST"])
def delete_network_bar_loadbanlances(request):
    ids = request.data.getlist('ids[]')
    Network_Bar_Loadbanlance.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Network_Bar_Loadbanlances have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_network_bar_loadbanlance(request):
    try:

        pk = request.data['id']
        LOG.info("---- network_bar_loadbanlance pk is --------" + str(pk))

        network_bar_loadbanlance = Network_Bar_Loadbanlance.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        network_bar_loadbanlance.network_bar_loadbanlancename = request.data['network_bar_loadbanlancename']

        LOG.info("dddddddddddd")
        network_bar_loadbanlance.save()
        #Operation.log(network_bar_loadbanlance, network_bar_loadbanlance.name, 'update', udc=network_bar_loadbanlance.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Network_Bar_Loadbanlance is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update network_bar_loadbanlance, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update network_bar_loadbanlance for unknown reason.')})


@require_GET
def is_network_bar_loadbanlancename_unique(request):
    network_bar_loadbanlancename = request.GET['network_bar_loadbanlancename']
    LOG.info("network_bar_loadbanlancename is" + str(network_bar_loadbanlancename))
    return Response(not Network_Bar_Loadbanlance.objects.filter(network_bar_loadbanlancename=network_bar_loadbanlancename).exists())
