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
from biz.phy_monitor.models import Phy_Monitor 
from biz.phy_monitor.serializer import Phy_MonitorSerializer
from biz.phy_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Phy_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am phy_monitor list in Phy_MonitorList ----------")
    queryset = Phy_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Phy_MonitorSerializer



@require_POST
def create_phy_monitor(request):

    try:
        serializer = Phy_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Phy_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Phy_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create phy_monitor for unknown reason.')})



@api_view(["POST"])
def delete_phy_monitors(request):
    ids = request.data.getlist('ids[]')
    Phy_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Phy_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_phy_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- phy_monitor pk is --------" + str(pk))

        phy_monitor = Phy_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        phy_monitor.phy_monitorname = request.data['phy_monitorname']

        LOG.info("dddddddddddd")
        phy_monitor.save()
        #Operation.log(phy_monitor, phy_monitor.name, 'update', udc=phy_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Phy_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update phy_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update phy_monitor for unknown reason.')})


@require_GET
def is_phy_monitorname_unique(request):
    phy_monitorname = request.GET['phy_monitorname']
    LOG.info("phy_monitorname is" + str(phy_monitorname))
    return Response(not Phy_Monitor.objects.filter(phy_monitorname=phy_monitorname).exists())
