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
from biz.myapp.models import Myapp 
from biz.myapp.serializer import MyappSerializer
from biz.myapp.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class MyappList(generics.ListAPIView):
    LOG.info("--------- I am myapp list in MyappList ----------")
    queryset = Myapp.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = MyappSerializer



@require_POST
def create_myapp(request):

    try:
        serializer = MyappSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Myapp is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Myapp data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create myapp for unknown reason.')})



@api_view(["POST"])
def delete_myapps(request):
    ids = request.data.getlist('ids[]')
    Myapp.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Myapps have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_myapp(request):
    try:

        pk = request.data['id']
        LOG.info("---- myapp pk is --------" + str(pk))

        myapp = Myapp.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        myapp.myappname = request.data['myappname']

        LOG.info("dddddddddddd")
        myapp.save()
        #Operation.log(myapp, myapp.name, 'update', udc=myapp.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Myapp is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update myapp, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update myapp for unknown reason.')})


@require_GET
def is_myappname_unique(request):
    myappname = request.GET['myappname']
    LOG.info("myappname is" + str(myappname))
    return Response(not Myapp.objects.filter(myappname=myappname).exists())
