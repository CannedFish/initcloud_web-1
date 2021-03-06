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
from biz.cloud_monitor.models import Cloud_Monitor 
from biz.cloud_monitor.serializer import Cloud_MonitorSerializer
from biz.cloud_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Cloud_MonitorList(generics.ListAPIView):
    LOG.info("--------- I am cloud_monitor list in Cloud_MonitorList ----------")
    queryset = Cloud_Monitor.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Cloud_MonitorSerializer



@require_POST
def create_cloud_monitor(request):

    try:
        serializer = Cloud_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Cloud_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Cloud_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create cloud_monitor for unknown reason.')})



@api_view(["POST"])
def delete_cloud_monitors(request):
    ids = request.data.getlist('ids[]')
    Cloud_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Cloud_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_cloud_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- cloud_monitor pk is --------" + str(pk))

        cloud_monitor = Cloud_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        cloud_monitor.cloud_monitorname = request.data['cloud_monitorname']

        LOG.info("dddddddddddd")
        cloud_monitor.save()
        #Operation.log(cloud_monitor, cloud_monitor.name, 'update', udc=cloud_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Cloud_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update cloud_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update cloud_monitor for unknown reason.')})


@require_GET
def is_cloud_monitorname_unique(request):
    cloud_monitorname = request.GET['cloud_monitorname']
    LOG.info("cloud_monitorname is" + str(cloud_monitorname))
    return Response(not Cloud_Monitor.objects.filter(cloud_monitorname=cloud_monitorname).exists())
