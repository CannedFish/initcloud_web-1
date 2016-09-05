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
from biz.phy_monitor_storage.models import Phy_Monitor_Storage 
from biz.phy_monitor_storage.serializer import Phy_Monitor_StorageSerializer
from biz.phy_monitor_storage.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Phy_Monitor_StorageList(generics.ListAPIView):
    LOG.info("--------- I am phy_monitor_storage list in Phy_Monitor_StorageList ----------")
    queryset = Phy_Monitor_Storage.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Phy_Monitor_StorageSerializer



@require_POST
def create_phy_monitor_storage(request):

    try:
        serializer = Phy_Monitor_StorageSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Phy_Monitor_Storage is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Phy_Monitor_Storage data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create phy_monitor_storage for unknown reason.')})



@api_view(["POST"])
def delete_phy_monitor_storages(request):
    ids = request.data.getlist('ids[]')
    Phy_Monitor_Storage.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Phy_Monitor_Storages have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_phy_monitor_storage(request):
    try:

        pk = request.data['id']
        LOG.info("---- phy_monitor_storage pk is --------" + str(pk))

        phy_monitor_storage = Phy_Monitor_Storage.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        phy_monitor_storage.phy_monitor_storagename = request.data['phy_monitor_storagename']

        LOG.info("dddddddddddd")
        phy_monitor_storage.save()
        #Operation.log(phy_monitor_storage, phy_monitor_storage.name, 'update', udc=phy_monitor_storage.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Phy_Monitor_Storage is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update phy_monitor_storage, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update phy_monitor_storage for unknown reason.')})


@require_GET
def is_phy_monitor_storagename_unique(request):
    phy_monitor_storagename = request.GET['phy_monitor_storagename']
    LOG.info("phy_monitor_storagename is" + str(phy_monitor_storagename))
    return Response(not Phy_Monitor_Storage.objects.filter(phy_monitor_storagename=phy_monitor_storagename).exists())
