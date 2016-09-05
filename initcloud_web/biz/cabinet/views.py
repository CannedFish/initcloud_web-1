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
from biz.cabinet.models import Cabinet 
from biz.cabinet.serializer import CabinetSerializer
from biz.cabinet.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class CabinetList(generics.ListAPIView):
    LOG.info("--------- I am cabinet list in CabinetList ----------")
    queryset = Cabinet.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = CabinetSerializer



@require_POST
def create_cabinet(request):

    try:
        serializer = CabinetSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Cabinet is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Cabinet data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create cabinet for unknown reason.')})



@api_view(["POST"])
def delete_cabinets(request):
    ids = request.data.getlist('ids[]')
    Cabinet.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Cabinets have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_cabinet(request):
    try:

        pk = request.data['id']
        LOG.info("---- cabinet pk is --------" + str(pk))

        cabinet = Cabinet.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        cabinet.cabinetname = request.data['cabinetname']

        LOG.info("dddddddddddd")
        cabinet.save()
        #Operation.log(cabinet, cabinet.name, 'update', udc=cabinet.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Cabinet is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update cabinet, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update cabinet for unknown reason.')})


@require_GET
def is_cabinetname_unique(request):
    cabinetname = request.GET['cabinetname']
    LOG.info("cabinetname is" + str(cabinetname))
    return Response(not Cabinet.objects.filter(cabinetname=cabinetname).exists())
