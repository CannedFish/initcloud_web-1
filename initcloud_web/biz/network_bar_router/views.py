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
from biz.network_bar_router.models import Network_Bar_Router 
from biz.network_bar_router.serializer import Network_Bar_RouterSerializer
from biz.network_bar_router.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.cloud_utils import create_rc_manually
from cloud.api import neutron
LOG = logging.getLogger(__name__)


class Network_Bar_RouterList(generics.ListAPIView):
    LOG.info("--------- I am network_bar_router list in Network_Bar_RouterList ----------")
    queryset = Network_Bar_Router.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Network_Bar_RouterSerializer
    def list(self, request):
	rc = create_rc_manually(request)
	routers = neutron.router_list(rc)
	data = []
	for router in routers:
            LOG.info("start to get router")

            LOG.info("*** router id is *****" + str(router.id))
	    for port in neutron.port_list(rc, device_id = router.id):
		port_data = {}
		port_data['ip_type'] = port.device_owner
		port_data['ip_connect_vm'] = port.mac_address
		for interface in port.fixed_ips:
		    port_data['ip'] = interface['ip_address']
		data.append(port_data)
	return Response(data) 


@require_POST
def create_network_bar_router(request):

    try:
        serializer = Network_Bar_RouterSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Network_Bar_Router is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Network_Bar_Router data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create network_bar_router for unknown reason.')})



@api_view(["POST"])
def delete_network_bar_routers(request):
    ids = request.data.getlist('ids[]')
    Network_Bar_Router.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Network_Bar_Routers have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_network_bar_router(request):
    try:

        pk = request.data['id']
        LOG.info("---- network_bar_router pk is --------" + str(pk))

        network_bar_router = Network_Bar_Router.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        network_bar_router.network_bar_routername = request.data['network_bar_routername']

        LOG.info("dddddddddddd")
        network_bar_router.save()
        #Operation.log(network_bar_router, network_bar_router.name, 'update', udc=network_bar_router.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Network_Bar_Router is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update network_bar_router, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update network_bar_router for unknown reason.')})


@require_GET
def is_network_bar_routername_unique(request):
    network_bar_routername = request.GET['network_bar_routername']
    LOG.info("network_bar_routername is" + str(network_bar_routername))
    return Response(not Network_Bar_Router.objects.filter(network_bar_routername=network_bar_routername).exists())
