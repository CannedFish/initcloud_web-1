# -*-coding:utf8 -*-

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
from biz.network_bar_net.models import Network_Bar_Net 
from biz.network_bar_net.serializer import Network_Bar_NetSerializer
from biz.network_bar_net.utils import * 
from biz.idc.models import DataCenter
from biz.common.pagination import PagePagination
from biz.common.decorators import require_POST, require_GET
from biz.common.utils import retrieve_params, fail
from biz.workflow.models import Step
from cloud.tasks import (link_user_to_dc_task, send_notifications,
                         send_notifications_by_data_center)
from frontend.forms import CloudUserCreateFormWithoutCapatcha

from cloud.api import neutron
from cloud.cloud_utils import create_rc_manually
import traceback
LOG = logging.getLogger(__name__)

class Network_Bar_NetList(generics.ListAPIView):
    """
    Handle request to '^network_bar_net/$'
    """
    LOG.info("--------- I am network_bar_net list in Network_Bar_NetList ----------")
    queryset = Network_Bar_Net.objects.all()
    LOG.info("--------- Queryset is --------------" + str(queryset)) 
    serializer_class = Network_Bar_NetSerializer
    def list(self, request):
	try:
	    LOG.info('------------ NETWORK ---------------')
	    rc = create_rc_manually(request)
	    networks = neutron.network_list(rc)
            data = []
	    total = 0
	    for each in networks:
		total = total + 1
	        LOG.info(each.name)
		network= {}
		network['label'] = each.name
		network['data'] = {'num':11124875,'description':'1,104'}
		network['children'] = []
                #LOG.info(" network is" +str(network))
		for subnets in each.subnets:
		    subnet = {}
		    subnet['label'] = subnets.name
		    subnet['children'] = []
		    subnet['data'] = {'num':11124875,'description':'1,104'}
		    network['children'].append(subnet)
                    #LOG.info(" subnet is " + str(subnet))
		    for routers in neutron.router_list(rc):
			router = {}
			#LOG.info(routers)
			port = neutron.port_list(rc, device_id = routers.id)
			for ports in port:
			    for interface in ports.fixed_ips:
				if subnets.id==interface['subnet_id']:
				    #LOG.info(interface.['subnet_id'])
				    router['label'] = routers.name
				    router['data'] = {'num':11124875,'description':'10444'}
				    #router['data'] = {'description':routers.}
				    subnet['children'].append(router)
                data.append(network)
	    #LOG.info(data)
	    return_data = {}
	    return_data['list'] = data
	    return_data['total'] = total
	    #LOG.info('---------ROUTER-------------')
	    #for each in neutron.router_list(rc):
                #LOG.info("router is " + each.name)
		#port = neutron.port_list(rc, device_id =each.id)
		#for ports in port:
		    #LOG.info(ports)
		    #for subnet in ports.fixed_ips:
			#LOG.info("subnetid_id is" + subnet['subnet_id'])    
	    #return Response(treedata_network)
	    return Response(return_data)
	except:
	    #traceback.print_exc()
	    treedata_network=[
	    {
		'label':'net1',
		'data':{'num':'11124875','description':'1104'},
		'children':[
		    {
			'label':'subnet1',
			'data':{'num':'65124875','description':'1104'},
			'children':[
			    {
				'label':'router1',
				'data':{'num':'57824875','description':'1104'},
			    }
			]
		    }
		]
	    },
	    {
		'label':'net2',
		'data':{'num':'11124875','description':'1104'},
		'children':[
		    {
			'label':'subnet2',
			'data':{'num':'65124875','description':'1104'},
			'children':[
			    {
				'label':'router2',
				'data':{'num':'57824875','description':'1104'},
			    }
			]
		    }
		]
	    },
	    {
		'label':'net3',
		'data':{'num':'11124875','description':'1104'},
		'children':[
		    {
			'label':'subnet3',
			'data':{'num':'65124875','description':'1104'},
			'children':[
			    {
				'label':'router3',
				'data':{'num':'57824875','description':'1104'},
			    }
			]
		    }
		]
	    }
	    ];
	    return Response(treedata_network)



@require_GET
def is_network_bar_netname_unique(request):
    network_bar_netname = request.GET['network_bar_netname']
    LOG.info("network_bar_netname is" + str(network_bar_netname))
    return Response(not Network_Bar_Net.objects.filter(network_bar_netname=network_bar_netname).exists())
