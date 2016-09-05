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
from biz.service__bar.models import Service__Bar 
from biz.service__bar.serializer import Service__BarSerializer
from biz.service__bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Service__BarList(generics.ListAPIView):
    LOG.info("--------- I am service__bar list in Service__BarList ----------")
    queryset = Service__Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Service__BarSerializer



@require_POST
def create_service__bar(request):

    try:
        serializer = Service__BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Service__Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Service__Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create service__bar for unknown reason.')})



@api_view(["POST"])
def delete_service__bars(request):
    ids = request.data.getlist('ids[]')
    Service__Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Service__Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_service__bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- service__bar pk is --------" + str(pk))

        service__bar = Service__Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        service__bar.service__barname = request.data['service__barname']

        LOG.info("dddddddddddd")
        service__bar.save()
        #Operation.log(service__bar, service__bar.name, 'update', udc=service__bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Service__Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update service__bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update service__bar for unknown reason.')})


@require_GET
def is_service__barname_unique(request):
    service__barname = request.GET['service__barname']
    LOG.info("service__barname is" + str(service__barname))
    return Response(not Service__Bar.objects.filter(service__barname=service__barname).exists())
