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
from biz.virtualmechine_bar.models import Virtualmechine_Bar 
from biz.virtualmechine_bar.serializer import Virtualmechine_BarSerializer
from biz.virtualmechine_bar.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha
from cloud.api import nova
from cloud.api import cinder
from cloud.api import ceilometer
from cloud.cloud_utils import create_rc_manually
import traceback
LOG = logging.getLogger(__name__)


class Virtualmechine_BarList(generics.ListAPIView):
    LOG.info("--------- I am virtualmechine_bar list in Virtualmechine_BarList ----------")
    queryset = Virtualmechine_Bar.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Virtualmechine_BarSerializer
    def list(self, request):
	try:
	    LOG.info('111111111111111111111111111')
	    rc = create_rc_manually(request)
	    pan = cinder.volume_list(rc, {'all_tenants':1})
	    LOG.info(pan)
	    cm = nova.server_list(rc, all_tenants=True)[0]
	    est_cm = len(cm)
	    running_cm = 0
	    cloud_allocat_mem = 0
	    cloud_kernel = 0
	    total_ypan = 0
	    try:
		total_ypan = len(pan)
	    except:
		total_ypan = 0
	    for each in cm:
		if each.status == 'ACTIVE':
		    running_cm = running_cm + 1
	    LOG.info('3333333333333333333333333')
	    #hypervisors = nova.hypervisor_list(rc)
            #for each in hypervisors:
                #vcpus_used = vcpus_used + each.vcpus_used
            #    vcpus_used = vcpus_used + each.memory_mb
            #LOG.info(vcpus_used)
            total_kernel = nova.hypervisor_stats(rc).vcpus
            total_memory = nova.hypervisor_stats(rc).memory_mb
            cloud_kernel = nova.hypervisor_stats(rc).vcpus_used
            cloud_allocat_mem = nova.hypervisor_stats(rc).memory_mb_used
            total_capacity = nova.hypervisor_stats(rc).local_gb
	    LOG.info('222222222222222222222222222222')
	    return_data = []
	    return_data.append({"total_kernel":total_kernel,'total_memory':total_memory,'cloud_kernel':cloud_kernel,'cloud_allocat_memory':cloud_allocat_mem,
                'established_cloudmechine':est_cm,'running_cloudmechine':running_cm,'total_ypan':total_ypan,'total_capacity':total_capacity,
                'storage':{'n':[30,70],'h':[40,60],'RAY':[50,50]},'empty_float_ip':'100','used_float_ip':'200'
})
	    #LOG.info(return_data)
	    return Response(return_data)
	except:
	    #trackback.print_exc()
	    return_data = []	
	    return_data.append({"total_kernel":16,'total_memory':28422,'cloud_kernel':'4','cloud_allocat_memory':'1024',
                'established_cloudmechine':'2','running_cloudmechine':'2','total_ypan':'1','total_capacity':'99',
                'storage':{'n':[30,70],'h':[40,60],'RAY':[50,50]},'empty_float_ip':'100','used_float_ip':'200'
})
	    return Response(return_data)	    


@require_POST
def create_virtualmechine_bar(request):

    try:
        serializer = Virtualmechine_BarSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, "msg": _('Virtualmechine_Bar is created successfully!')},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"success": False, "msg": _('Virtualmechine_Bar data is not valid!'),
                             'errors': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:

        LOG.error("Failed to create flavor, msg:[%s]" % e)
        return Response({"success": False, "msg": _('Failed to create virtualmechine_bar for unknown reason.')})



@api_view(["POST"])
def delete_virtualmechine_bars(request):
    ids = request.data.getlist('ids[]')
    Virtualmechine_Bar.objects.filter(pk__in=ids).delete()
    return Response({'success': True, "msg": _('Virtualmechine_Bars have been deleted!')}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_virtualmechine_bar(request):
    try:

        pk = request.data['id']
        LOG.info("---- virtualmechine_bar pk is --------" + str(pk))

        virtualmechine_bar = Virtualmechine_Bar.objects.get(pk=pk)
        LOG.info("ddddddddddddd")
        LOG.info("request.data is" + str(request.data))
        virtualmechine_bar.virtualmechine_barname = request.data['virtualmechine_barname']

        LOG.info("dddddddddddd")
        virtualmechine_bar.save()
        #Operation.log(virtualmechine_bar, virtualmechine_bar.name, 'update', udc=virtualmechine_bar.udc,
        #              user=request.user)

        return Response(
            {'success': True, "msg": _('Virtualmechine_Bar is updated successfully!')},
            status=status.HTTP_201_CREATED)

    except Exception as e:
        LOG.error("Failed to update virtualmechine_bar, msg:[%s]" % e)
        return Response({"success": False, "msg": _(
            'Failed to update virtualmechine_bar for unknown reason.')})


@require_GET
def is_virtualmechine_barname_unique(request):
    virtualmechine_barname = request.GET['virtualmechine_barname']
    LOG.info("virtualmechine_barname is" + str(virtualmechine_barname))
    return Response(not Virtualmechine_Bar.objects.filter(virtualmechine_barname=virtualmechine_barname).exists())
