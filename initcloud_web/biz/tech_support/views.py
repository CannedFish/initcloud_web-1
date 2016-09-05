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
from biz.tech_support.models import Tech_Support 
from biz.tech_support.serializer import Tech_SupportSerializer
from biz.tech_support.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Tech_SupportList(generics.ListAPIView):
    LOG.info("--------- I am tech_support list in Tech_SupportList ----------")
    queryset = Tech_Support.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Tech_SupportSerializer



@require_POST
def create_tech_support(request):

    try:
        serializer = Tech_SupportSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Tech_Support is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Tech_Support data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create tech_support for unknown reason.')})



@api_view(["POST"])
def delete_tech_supports(request):
    ids = request.data.getlist('ids[]')
    Tech_Support.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Tech_Supports have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_tech_support(request):
    try:

        pk = request.data['id']
        LOG.info("---- tech_support pk is --------" + str(pk))

        tech_support = Tech_Support.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        tech_support.tech_supportname = request.data['tech_supportname']

        LOG.info("dddddddddddd")
        tech_support.save()
        #Operation.log(tech_support, tech_support.name, 'update', udc=tech_support.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Tech_Support is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update tech_support, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update tech_support for unknown reason.')})


@require_GET
def is_tech_supportname_unique(request):
    tech_supportname = request.GET['tech_supportname']
    LOG.info("tech_supportname is" + str(tech_supportname))
    return Response(not Tech_Support.objects.filter(tech_supportname=tech_supportname).exists())
