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
from biz.bb.models import Bb 
from biz.bb.serializer import BbSerializer
from biz.bb.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class BbList(generics.ListAPIView):
    LOG.info("--------- I am bb list in BbList ----------")
    queryset = Bb.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = BbSerializer



@require_POST
def create_bb(request):

    try:
        serializer = BbSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Bb is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Bb data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create bb for unknown reason.')})



@api_view(["POST"])
def delete_bbs(request):
    ids = request.data.getlist('ids[]')
    Bb.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Bbs have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_bb(request):
    try:

        pk = request.data['id']
        LOG.info("---- bb pk is --------" + str(pk))

        bb = Bb.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        bb.bbname = request.data['bbname']

        LOG.info("dddddddddddd")
        bb.save()
        #Operation.log(bb, bb.name, 'update', udc=bb.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Bb is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update bb, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update bb for unknown reason.')})


@require_GET
def is_bbname_unique(request):
    bbname = request.GET['bbname']
    LOG.info("bbname is" + str(bbname))
    return Response(not Bb.objects.filter(bbname=bbname).exists())
