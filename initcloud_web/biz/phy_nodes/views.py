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
from biz.phy_nodes.models import Phy_Nodes 
from biz.phy_nodes.serializer import Phy_NodesSerializer
from biz.phy_nodes.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

LOG = logging.getLogger(__name__)


class Phy_NodesList(generics.ListAPIView):
    LOG.info("--------- I am phy_nodes list in Phy_NodesList ----------")
    queryset = Phy_Nodes.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Phy_NodesSerializer



@require_POST
def create_phy_nodes(request):

    try:
        serializer = Phy_NodesSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Phy_Nodes is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Phy_Nodes data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create phy_nodes for unknown reason.')})



@api_view(["POST"])
def delete_phy_nodess(request):
    ids = request.data.getlist('ids[]')
    Phy_Nodes.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Phy_Nodess have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_phy_nodes(request):
    try:

        pk = request.data['id']
        LOG.info("---- phy_nodes pk is --------" + str(pk))

        phy_nodes = Phy_Nodes.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        phy_nodes.phy_nodesname = request.data['phy_nodesname']

        LOG.info("dddddddddddd")
        phy_nodes.save()
        #Operation.log(phy_nodes, phy_nodes.name, 'update', udc=phy_nodes.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Phy_Nodes is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update phy_nodes, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update phy_nodes for unknown reason.')})


@require_GET
def is_phy_nodesname_unique(request):
    phy_nodesname = request.GET['phy_nodesname']
    LOG.info("phy_nodesname is" + str(phy_nodesname))
    return Response(not Phy_Nodes.objects.filter(phy_nodesname=phy_nodesname).exists())
