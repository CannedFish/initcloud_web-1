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
from biz.treeview.models import Treeview 
from biz.treeview.serializer import TreeviewSerializer
from biz.treeview.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class TreeviewList(generics.ListAPIView):
    LOG.info("--------- I am treeview list in TreeviewList ----------")
    queryset = Treeview.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = TreeviewSerializer



@require_POST
def create_treeview(request):

    try:
        serializer = TreeviewSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Treeview is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Treeview data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create treeview for unknown reason.')})



@api_view(["POST"])
def delete_treeviews(request):
    ids = request.data.getlist('ids[]')
    Treeview.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Treeviews have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_treeview(request):
    try:

        pk = request.data['id']
        LOG.info("---- treeview pk is --------" + str(pk))

        treeview = Treeview.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        treeview.treeviewname = request.data['treeviewname']

        LOG.info("dddddddddddd")
        treeview.save()
        #Operation.log(treeview, treeview.name, 'update', udc=treeview.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Treeview is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update treeview, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update treeview for unknown reason.')})


@require_GET
def is_treeviewname_unique(request):
    treeviewname = request.GET['treeviewname']
    LOG.info("treeviewname is" + str(treeviewname))
    return Response(not Treeview.objects.filter(treeviewname=treeviewname).exists())
