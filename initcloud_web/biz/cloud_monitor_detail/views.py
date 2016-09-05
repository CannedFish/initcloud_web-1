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
from biz.cloud_monitor_detail.models import Cloud_Monitor_Detail 
from biz.cloud_monitor_detail.serializer import Cloud_Monitor_DetailSerializer
from biz.cloud_monitor_detail.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Cloud_Monitor_DetailList(generics.ListAPIView):
    LOG.info("--------- I am cloud_monitor_detail list in Cloud_Monitor_DetailList ----------")
    queryset = Cloud_Monitor_Detail.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Cloud_Monitor_DetailSerializer



@require_POST
def create_cloud_monitor_detail(request):

    try:
        serializer = Cloud_Monitor_DetailSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Cloud_Monitor_Detail is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Cloud_Monitor_Detail data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create cloud_monitor_detail for unknown reason.')})



@api_view(["POST"])
def delete_cloud_monitor_details(request):
    ids = request.data.getlist('ids[]')
    Cloud_Monitor_Detail.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Cloud_Monitor_Details have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_cloud_monitor_detail(request):
    try:

        pk = request.data['id']
        LOG.info("---- cloud_monitor_detail pk is --------" + str(pk))

        cloud_monitor_detail = Cloud_Monitor_Detail.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        cloud_monitor_detail.cloud_monitor_detailname = request.data['cloud_monitor_detailname']

        LOG.info("dddddddddddd")
        cloud_monitor_detail.save()
        #Operation.log(cloud_monitor_detail, cloud_monitor_detail.name, 'update', udc=cloud_monitor_detail.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Cloud_Monitor_Detail is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update cloud_monitor_detail, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update cloud_monitor_detail for unknown reason.')})


@require_GET
def is_cloud_monitor_detailname_unique(request):
    cloud_monitor_detailname = request.GET['cloud_monitor_detailname']
    LOG.info("cloud_monitor_detailname is" + str(cloud_monitor_detailname))
    return Response(not Cloud_Monitor_Detail.objects.filter(cloud_monitor_detailname=cloud_monitor_detailname).exists())
