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
from biz.network_monitor.models import Network_Monitor 
from biz.network_monitor.serializer import Network_MonitorSerializer
from biz.network_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Network_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am network_monitor list in Network_MonitorList ----------")
    queryset = Network_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Network_MonitorSerializer



@require_POST
def create_network_monitor(request):

    try:
        serializer = Network_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Network_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Network_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create network_monitor for unknown reason.')})



@api_view(["POST"])
def delete_network_monitors(request):
    ids = request.data.getlist('ids[]')
    Network_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Network_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_network_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- network_monitor pk is --------" + str(pk))

        network_monitor = Network_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        network_monitor.network_monitorname = request.data['network_monitorname']

        LOG.info("dddddddddddd")
        network_monitor.save()
        #Operation.log(network_monitor, network_monitor.name, 'update', udc=network_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Network_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update network_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update network_monitor for unknown reason.')})


@require_GET
def is_network_monitorname_unique(request):
    network_monitorname = request.GET['network_monitorname']
    LOG.info("network_monitorname is" + str(network_monitorname))
    return Response(not Network_Monitor.objects.filter(network_monitorname=network_monitorname).exists())
