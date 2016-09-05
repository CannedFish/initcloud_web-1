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
from biz.wuli_storage.models import Wuli_Storage 
from biz.wuli_storage.serializer import Wuli_StorageSerializer
from biz.wuli_storage.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Wuli_StorageList(generics.ListAPIView):
    LOG.info("--------- I am wuli_storage list in Wuli_StorageList ----------")
    queryset = Wuli_Storage.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Wuli_StorageSerializer



@require_POST
def create_wuli_storage(request):

    try:
        serializer = Wuli_StorageSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Wuli_Storage is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Wuli_Storage data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create wuli_storage for unknown reason.')})



@api_view(["POST"])
def delete_wuli_storages(request):
    ids = request.data.getlist('ids[]')
    Wuli_Storage.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Wuli_Storages have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_wuli_storage(request):
    try:

        pk = request.data['id']
        LOG.info("---- wuli_storage pk is --------" + str(pk))

        wuli_storage = Wuli_Storage.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        wuli_storage.wuli_storagename = request.data['wuli_storagename']

        LOG.info("dddddddddddd")
        wuli_storage.save()
        #Operation.log(wuli_storage, wuli_storage.name, 'update', udc=wuli_storage.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Wuli_Storage is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update wuli_storage, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update wuli_storage for unknown reason.')})


@require_GET
def is_wuli_storagename_unique(request):
    wuli_storagename = request.GET['wuli_storagename']
    LOG.info("wuli_storagename is" + str(wuli_storagename))
    return Response(not Wuli_Storage.objects.filter(wuli_storagename=wuli_storagename).exists())
