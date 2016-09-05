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
from biz.warning.models import Warning 
from biz.warning.serializer import WarningSerializer
from biz.warning.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class WarningList(generics.ListAPIView):
    LOG.info("--------- I am warning list in WarningList ----------")
    queryset = Warning.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = WarningSerializer



@require_POST
def create_warning(request):

    try:
        serializer = WarningSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Warning is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Warning data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create warning for unknown reason.')})



@api_view(["POST"])
def delete_warnings(request):
    ids = request.data.getlist('ids[]')
    Warning.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Warnings have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_warning(request):
    try:

        pk = request.data['id']
        LOG.info("---- warning pk is --------" + str(pk))

        warning = Warning.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        warning.warningname = request.data['warningname']

        LOG.info("dddddddddddd")
        warning.save()
        #Operation.log(warning, warning.name, 'update', udc=warning.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Warning is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update warning, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update warning for unknown reason.')})


@require_GET
def is_warningname_unique(request):
    warningname = request.GET['warningname']
    LOG.info("warningname is" + str(warningname))
    return Response(not Warning.objects.filter(warningname=warningname).exists())
