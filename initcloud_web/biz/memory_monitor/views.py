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
from biz.memory_monitor.models import Memory_Monitor 
from biz.memory_monitor.serializer import Memory_MonitorSerializer
from biz.memory_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Memory_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am memory_monitor list in Memory_MonitorList ----------")
    queryset = Memory_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Memory_MonitorSerializer



@require_POST
def create_memory_monitor(request):

    try:
        serializer = Memory_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Memory_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Memory_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create memory_monitor for unknown reason.')})



@api_view(["POST"])
def delete_memory_monitors(request):
    ids = request.data.getlist('ids[]')
    Memory_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Memory_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_memory_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- memory_monitor pk is --------" + str(pk))

        memory_monitor = Memory_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        memory_monitor.memory_monitorname = request.data['memory_monitorname']

        LOG.info("dddddddddddd")
        memory_monitor.save()
        #Operation.log(memory_monitor, memory_monitor.name, 'update', udc=memory_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Memory_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update memory_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update memory_monitor for unknown reason.')})


@require_GET
def is_memory_monitorname_unique(request):
    memory_monitorname = request.GET['memory_monitorname']
    LOG.info("memory_monitorname is" + str(memory_monitorname))
    return Response(not Memory_Monitor.objects.filter(memory_monitorname=memory_monitorname).exists())
