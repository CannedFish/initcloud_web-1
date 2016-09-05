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
from biz.vm_monitor.models import Vm_Monitor 
from biz.vm_monitor.serializer import Vm_MonitorSerializer
from biz.vm_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Vm_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am vm_monitor list in Vm_MonitorList ----------")
    queryset = Vm_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Vm_MonitorSerializer



@require_POST
def create_vm_monitor(request):

    try:
        serializer = Vm_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Vm_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Vm_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create vm_monitor for unknown reason.')})



@api_view(["POST"])
def delete_vm_monitors(request):
    ids = request.data.getlist('ids[]')
    Vm_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Vm_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_vm_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- vm_monitor pk is --------" + str(pk))

        vm_monitor = Vm_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        vm_monitor.vm_monitorname = request.data['vm_monitorname']

        LOG.info("dddddddddddd")
        vm_monitor.save()
        #Operation.log(vm_monitor, vm_monitor.name, 'update', udc=vm_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Vm_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update vm_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update vm_monitor for unknown reason.')})


@require_GET
def is_vm_monitorname_unique(request):
    vm_monitorname = request.GET['vm_monitorname']
    LOG.info("vm_monitorname is" + str(vm_monitorname))
    return Response(not Vm_Monitor.objects.filter(vm_monitorname=vm_monitorname).exists())
