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
from biz.network_bar_net.models import Network_Bar_Net 
from biz.network_bar_net.serializer import Network_Bar_NetSerializer
from biz.network_bar_net.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Network_Bar_NetList(generics.ListAPIView):
    LOG.info("--------- I am network_bar_net list in Network_Bar_NetList ----------")
    queryset = Network_Bar_Net.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Network_Bar_NetSerializer



@require_POST
def create_network_bar_net(request):

    try:
        serializer = Network_Bar_NetSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Network_Bar_Net is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Network_Bar_Net data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create network_bar_net for unknown reason.')})



@api_view(["POST"])
def delete_network_bar_nets(request):
    ids = request.data.getlist('ids[]')
    Network_Bar_Net.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Network_Bar_Nets have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_network_bar_net(request):
    try:

        pk = request.data['id']
        LOG.info("---- network_bar_net pk is --------" + str(pk))

        network_bar_net = Network_Bar_Net.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        network_bar_net.network_bar_netname = request.data['network_bar_netname']

        LOG.info("dddddddddddd")
        network_bar_net.save()
        #Operation.log(network_bar_net, network_bar_net.name, 'update', udc=network_bar_net.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Network_Bar_Net is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update network_bar_net, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update network_bar_net for unknown reason.')})


@require_GET
def is_network_bar_netname_unique(request):
    network_bar_netname = request.GET['network_bar_netname']
    LOG.info("network_bar_netname is" + str(network_bar_netname))
    return Response(not Network_Bar_Net.objects.filter(network_bar_netname=network_bar_netname).exists())
