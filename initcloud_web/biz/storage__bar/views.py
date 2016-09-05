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
from biz.storage__bar.models import Storage__Bar 
from biz.storage__bar.serializer import Storage__BarSerializer
from biz.storage__bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Storage__BarList(generics.ListAPIView):
    LOG.info("--------- I am storage__bar list in Storage__BarList ----------")
    queryset = Storage__Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Storage__BarSerializer



@require_POST
def create_storage__bar(request):

    try:
        serializer = Storage__BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Storage__Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Storage__Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create storage__bar for unknown reason.')})



@api_view(["POST"])
def delete_storage__bars(request):
    ids = request.data.getlist('ids[]')
    Storage__Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Storage__Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_storage__bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- storage__bar pk is --------" + str(pk))

        storage__bar = Storage__Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        storage__bar.storage__barname = request.data['storage__barname']

        LOG.info("dddddddddddd")
        storage__bar.save()
        #Operation.log(storage__bar, storage__bar.name, 'update', udc=storage__bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Storage__Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update storage__bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update storage__bar for unknown reason.')})


@require_GET
def is_storage__barname_unique(request):
    storage__barname = request.GET['storage__barname']
    LOG.info("storage__barname is" + str(storage__barname))
    return Response(not Storage__Bar.objects.filter(storage__barname=storage__barname).exists())
