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
from biz.virtualmechine_bar.models import Virtualmechine_Bar 
from biz.virtualmechine_bar.serializer import Virtualmechine_BarSerializer
from biz.virtualmechine_bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Virtualmechine_BarList(generics.ListAPIView):
    LOG.info("--------- I am virtualmechine_bar list in Virtualmechine_BarList ----------")
    queryset = Virtualmechine_Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Virtualmechine_BarSerializer



@require_POST
def create_virtualmechine_bar(request):

    try:
        serializer = Virtualmechine_BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Virtualmechine_Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Virtualmechine_Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create virtualmechine_bar for unknown reason.')})



@api_view(["POST"])
def delete_virtualmechine_bars(request):
    ids = request.data.getlist('ids[]')
    Virtualmechine_Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Virtualmechine_Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_virtualmechine_bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- virtualmechine_bar pk is --------" + str(pk))

        virtualmechine_bar = Virtualmechine_Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        virtualmechine_bar.virtualmechine_barname = request.data['virtualmechine_barname']

        LOG.info("dddddddddddd")
        virtualmechine_bar.save()
        #Operation.log(virtualmechine_bar, virtualmechine_bar.name, 'update', udc=virtualmechine_bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Virtualmechine_Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update virtualmechine_bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update virtualmechine_bar for unknown reason.')})


@require_GET
def is_virtualmechine_barname_unique(request):
    virtualmechine_barname = request.GET['virtualmechine_barname']
    LOG.info("virtualmechine_barname is" + str(virtualmechine_barname))
    return Response(not Virtualmechine_Bar.objects.filter(virtualmechine_barname=virtualmechine_barname).exists())
