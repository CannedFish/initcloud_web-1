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
from biz.login.models import Login 
from biz.login.serializer import LoginSerializer
from biz.login.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class LoginList(generics.ListAPIView):
    LOG.info("--------- I am login list in LoginList ----------")
    queryset = Login.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = LoginSerializer



@require_POST
def create_login(request):

    try:
        serializer = LoginSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Login is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Login data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create login for unknown reason.')})



@api_view(["POST"])
def delete_logins(request):
    ids = request.data.getlist('ids[]')
    Login.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Logins have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_login(request):
    try:

        pk = request.data['id']
        LOG.info("---- login pk is --------" + str(pk))

        login = Login.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        login.loginname = request.data['loginname']

        LOG.info("dddddddddddd")
        login.save()
        #Operation.log(login, login.name, 'update', udc=login.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Login is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update login, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update login for unknown reason.')})


@require_GET
def is_loginname_unique(request):
    loginname = request.GET['loginname']
    LOG.info("loginname is" + str(loginname))
    return Response(not Login.objects.filter(loginname=loginname).exists())
