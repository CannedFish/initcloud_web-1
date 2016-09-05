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
from biz.storage_monitor.models import Storage_Monitor 
from biz.storage_monitor.serializer import Storage_MonitorSerializer
from biz.storage_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Storage_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am storage_monitor list in Storage_MonitorList ----------")
    queryset = Storage_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Storage_MonitorSerializer



@require_POST
def create_storage_monitor(request):

    try:
        serializer = Storage_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Storage_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Storage_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create storage_monitor for unknown reason.')})



@api_view(["POST"])
def delete_storage_monitors(request):
    ids = request.data.getlist('ids[]')
    Storage_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Storage_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_storage_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- storage_monitor pk is --------" + str(pk))

        storage_monitor = Storage_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        storage_monitor.storage_monitorname = request.data['storage_monitorname']

        LOG.info("dddddddddddd")
        storage_monitor.save()
        #Operation.log(storage_monitor, storage_monitor.name, 'update', udc=storage_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Storage_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update storage_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update storage_monitor for unknown reason.')})


@require_GET
def is_storage_monitorname_unique(request):
    storage_monitorname = request.GET['storage_monitorname']
    LOG.info("storage_monitorname is" + str(storage_monitorname))
    return Response(not Storage_Monitor.objects.filter(storage_monitorname=storage_monitorname).exists())
