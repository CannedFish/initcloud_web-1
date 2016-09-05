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
from biz.clouddisk_monitor.models import Clouddisk_Monitor 
from biz.clouddisk_monitor.serializer import Clouddisk_MonitorSerializer
from biz.clouddisk_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Clouddisk_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am clouddisk_monitor list in Clouddisk_MonitorList ----------")
    queryset = Clouddisk_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Clouddisk_MonitorSerializer



@require_POST
def create_clouddisk_monitor(request):

    try:
        serializer = Clouddisk_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Clouddisk_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Clouddisk_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create clouddisk_monitor for unknown reason.')})



@api_view(["POST"])
def delete_clouddisk_monitors(request):
    ids = request.data.getlist('ids[]')
    Clouddisk_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Clouddisk_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_clouddisk_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- clouddisk_monitor pk is --------" + str(pk))

        clouddisk_monitor = Clouddisk_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        clouddisk_monitor.clouddisk_monitorname = request.data['clouddisk_monitorname']

        LOG.info("dddddddddddd")
        clouddisk_monitor.save()
        #Operation.log(clouddisk_monitor, clouddisk_monitor.name, 'update', udc=clouddisk_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Clouddisk_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update clouddisk_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update clouddisk_monitor for unknown reason.')})


@require_GET
def is_clouddisk_monitorname_unique(request):
    clouddisk_monitorname = request.GET['clouddisk_monitorname']
    LOG.info("clouddisk_monitorname is" + str(clouddisk_monitorname))
    return Response(not Clouddisk_Monitor.objects.filter(clouddisk_monitorname=clouddisk_monitorname).exists())
