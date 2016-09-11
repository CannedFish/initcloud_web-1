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
#from biz.cloud_monitor_detail.models import Cloud_Monitor_Detail 
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

@require_POST
def get_detail(request):
    LOG.info('--------------- CLOUD MONITOR DETAIL ---------------')
    LOG.info(request)
