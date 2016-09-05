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
from biz.network_bar.models import Network_Bar 
from biz.network_bar.serializer import Network_BarSerializer
from biz.network_bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Network_BarList(generics.ListAPIView):
    LOG.info("--------- I am network_bar list in Network_BarList ----------")
    queryset = Network_Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Network_BarSerializer



@require_POST
def create_network_bar(request):

    try:
        serializer = Network_BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Network_Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Network_Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create network_bar for unknown reason.')})



@api_view(["POST"])
def delete_network_bars(request):
    ids = request.data.getlist('ids[]')
    Network_Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Network_Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_network_bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- network_bar pk is --------" + str(pk))

        network_bar = Network_Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        network_bar.network_barname = request.data['network_barname']

        LOG.info("dddddddddddd")
        network_bar.save()
        #Operation.log(network_bar, network_bar.name, 'update', udc=network_bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Network_Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update network_bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update network_bar for unknown reason.')})


@require_GET
def is_network_barname_unique(request):
    network_barname = request.GET['network_barname']
    LOG.info("network_barname is" + str(network_barname))
    return Response(not Network_Bar.objects.filter(network_barname=network_barname).exists())
