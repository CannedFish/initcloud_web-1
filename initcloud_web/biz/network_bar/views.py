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
#from biz.network_bar.models import Network_Bar 
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
from cloud.cloud_utils import create_rc_manually
from cloud.api import ceilometer
from cloud.api import nova
import traceback
import random

LOG = logging.getLogger(__name__)

def make_fake(period = 6, mi = 0, ma = 10):
    """
    Return fake data index
    """
    return_data = []
    for i in range(0, period - 1):
        return_data.append([i, round(random.uniform(mi, ma),2)])
    return return_data
def get_sample_data(request, meter_name, resource_id, project_id = None):
    """
    Return index of sample data of hour
    """
    query = [{'field':'resource_id', 'op':'eq', 'value':resource_id}]
    sample_data = ceilometer.sample_list(request, meter_name, query, limit = 7)
    hour_data = []
    for hour in range(0,6):
        try:
            hour_data.append([hour, sample_data[hour].counter_volume])
        except IndexError:
            hour_data.append([hour, 0])
        except:
            hour_data.append([hour, 4])
    return hour_data

class Network_BarList(generics.ListAPIView):
    """
    Handle request to '^network_bar/$'
    """
    LOG.info("--------- I am network_bar list in Network_BarList ----------")
    def list(self, request):
	LOG.info('--------------NETWORK BAR -----------------')
	try:
	    rc = create_rc_manually(request)
	    clouds = nova.server_list(rc, all_tenants = True)[0]
	    incoming = []
	    outgoing = []
	    incoming_pkg = []
	    outgoing_pkg = []
	    if settings.CLOUD_MONITOR_FAKE:
	        uprate = make_fake(6, 0.1, 1.2)
	        downrate = make_fake(6, 0.1, 1.2)
	        uppacket = make_fake(6, 1, 12)
	        downpacket = make_fake(6, 1, 12)
		return_data = []
                return_data.append({'uprate':uprate,'downrate':downrate,'updatapackage':uppacket,'downdatapackage':downpacket})
                return Response(return_data)
	    for each in clouds:
		avg_incoming = get_sample_data(rc, 'network.incoming.bytes.rate', each.id)
		incoming.append(avg_incoming)
		avg_outgoing = get_sample_data(rc, 'network.outgoing.bytes.rate', each.id)
                outgoing.append(avg_outgoing)
		avg_incoming_pkg = get_sample_data(rc, 'network.outgoing.packets.rate', each.id)
                incoming_pkg.append(avg_incoming_pkg)
		avg_outgoing_pkg = get_sample_data(rc, 'network.outgoing.packets.rate', each.id)
                outgoing_pkg.append(avg_outgoing_pkg)
	    uprate = incoming[0]
	    downrate = outgoing[0]
	    uppacket = incoming_pkg[0]
	    downpacket = outgoing_pkg[0]
	    #LOG.info([uprate, downrate, uppacket, downpacket])
	    return_data = []
	    return_data.append({'uprate':uprate,'downrate':downrate,'uppacket':uppacket,'downpacket':downpacket})
	    return Response(return_data)
	    #return Response({'uprate':[[0,1],[1,2],[2,2.2],[3,2.1],[4,2.5],[5,1.7]],'downrate':[[0,1.7],[1,2.2],[2,2.2],[3,2.1],[4,2.1],[5,1.7]],'uppacket':[[0,1],[1,2],[2,2.2],[3,2.1],[4,2.5],[5,1.7]],'downpacket':[[0,1],[1,2],[2,2.2],[3,1.6],[4,2.5],[5,1.7]]})
	except:
	    #trackback.print_exc()
	    return Response({'uprate':[[0,1],[1,2],[2,2.2],[3,2.1],[4,2.5],[5,1.7]],'downrate':[[0,1.7],[1,2.2],[2,2.2],[3,2.1],[4,2.1],[5,1.7]],'uppacket':[[0,1],[1,2],[2,2.2],[3,2.1],[4,2.5],[5,1.7]],'downpacket':[[0,1],[1,2],[2,2.2],[3,1.6],[4,2.5],[5,1.7]]})


	
