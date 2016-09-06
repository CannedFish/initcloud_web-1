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
from biz.volume_monitor.models import Volume_Monitor 
from biz.volume_monitor.serializer import Volume_MonitorSerializer
from biz.volume_monitor.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.cloud_utils import create_rc_by_dc, get_nova_admin
from cloud.api import cinder
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Volume_MonitorList(generics.ListAPIView):


    def list(self, request):
        LOG.info("start to get rc")
        rc = create_rc_by_dc(request)

        LOG.info("*** rc is ****" + str(rc))
        search_opts={'all_tenants': True}

        volumes = cinder.volume_list(rc, search_opts=search_opts)
        data = []
        for volume in volumes:
            LOG.info("**** volume is ****" + str(volume))
            attachments_ = volume.attachments
            LOG.info("*** attachments are ***" + str(attachments_))
            server_id = None
            for at in attachments_:
                server_id = at['server_id']
                server_name = None
                if server_id:
                    LOG.info("*** server_id ***" + str(server_id))
                    novaadmin = get_nova_admin(request)
                    LOG.info(novaadmin)
                    server = novaadmin.servers.get(server_id)
                    LOG.info("**** server is ****" + str(server))
                    server_name = server.name
                else:
                    server_name = "未挂载"
                data.append({"name": volume.name, "location": volume.availability_zone, "capacity": volume.size, "status": volume.status, "type": volume.volume_type, "mounting": server_name})

        LOG.info("*** data is ***" + str(data))
        return Response(data)
@require_POST
def create_volume_monitor(request):

    try:
        serializer = Volume_MonitorSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Volume_Monitor is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Volume_Monitor data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create volume_monitor for unknown reason.')})



@api_view(["POST"])
def delete_volume_monitors(request):
    ids = request.data.getlist('ids[]')
    Volume_Monitor.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Volume_Monitors have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_volume_monitor(request):
    try:

        pk = request.data['id']
        LOG.info("---- volume_monitor pk is --------" + str(pk))

        volume_monitor = Volume_Monitor.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        volume_monitor.volume_monitorname = request.data['volume_monitorname']

        LOG.info("dddddddddddd")
        volume_monitor.save()
        #Operation.log(volume_monitor, volume_monitor.name, 'update', udc=volume_monitor.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Volume_Monitor is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update volume_monitor, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update volume_monitor for unknown reason.')})


@require_GET
def is_volume_monitorname_unique(request):
    volume_monitorname = request.GET['volume_monitorname']
    LOG.info("volume_monitorname is" + str(volume_monitorname))
    return Response(not Volume_Monitor.objects.filter(volume_monitorname=volume_monitorname).exists())
