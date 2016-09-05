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
from biz.tab.models import Tab 
from biz.tab.serializer import TabSerializer
from biz.tab.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class TabList(generics.ListAPIView):
    LOG.info("--------- I am tab list in TabList ----------")
    queryset = Tab.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = TabSerializer



@require_POST
def create_tab(request):

    try:
        serializer = TabSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Tab is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Tab data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create tab for unknown reason.')})



@api_view(["POST"])
def delete_tabs(request):
    ids = request.data.getlist('ids[]')
    Tab.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Tabs have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_tab(request):
    try:

        pk = request.data['id']
        LOG.info("---- tab pk is --------" + str(pk))

        tab = Tab.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        tab.tabname = request.data['tabname']

        LOG.info("dddddddddddd")
        tab.save()
        #Operation.log(tab, tab.name, 'update', udc=tab.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Tab is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update tab, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update tab for unknown reason.')})


@require_GET
def is_tabname_unique(request):
    tabname = request.GET['tabname']
    LOG.info("tabname is" + str(tabname))
    return Response(not Tab.objects.filter(tabname=tabname).exists())
