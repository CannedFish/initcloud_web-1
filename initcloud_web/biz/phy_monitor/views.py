# -*- coding: utf-8 -*-

import logging, random

from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status

from biz.common.pagination import PagePagination
from biz.phy_monitor.serializer import CabinetSerializer,\
        PhyMonitorJBODSerializer, PhyMonitorNetworkSerializer,\
        PhyMonitorServerSerializer, PhyMonitorStorageSerializer

from django.conf import settings

import cloud.api.redfish as redfish
import cloud.api.storage as storage

LOG = logging.getLogger(__name__)

class CabinetDetail(APIView):
    def get(self, request):
        data = {
            '_24switchboard':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1],
            '_48switchboard_01':[
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,0
            ],
            '_48switchboard_02':[
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,0
            ],
            '_48switchboard_03':[
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,0
            ],
            'cpu_temperature':[
                {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]},  
            ],
            'jbod_status_01':[
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,1,
                1,0,1,0,1,1,1,1,0,1,1,0,0,0,0,
                1,0,1,0,1,1,0,1,1,0,1,1,0,0,1,
                1,1,0,1,1,0,0,0,1,1,1,0,1,1,1,
                1,1,0,1,1,0,0,0,1,1,0,1,0,1,0,
                1,0,1,1,0,0,0,1,1,0,0,0,1,1,1
            ],
            'jbod_status_02':[
                1,0,1,1,0,1,1,0,0,0,1,1,1,1,1,
                1,0,1,0,1,1,1,1,0,1,1,0,0,0,0,
                1,0,1,0,1,1,0,1,1,0,1,1,0,0,1,
                1,1,0,1,1,0,0,0,1,1,1,0,1,1,1,
                1,1,0,1,1,0,0,0,1,1,0,1,0,1,0,
                1,0,1,1,0,0,0,1,1,0,0,0,1,1,1
            ],
            'memory_server_status_01':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,1,1,0,1,1,0],
            'memory_server_status_02':[1,0,1,0,0,1,1,0,1,1,0,1,1,0,0,0,1,1,1,1]
        }
        serializer = CabinetSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PhyMonitorJBODDetail(APIView):
    def get(self, request):
        data = {
            'disk':[
                1,1,1,1,1,1,0,-1,0,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,0,-1,0,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,0,-1,0,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,0,-1,0,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,0,-1,0,1,1,1,1,1,1,1,1,1,
            ],
            'systemUI':[[1.2,12],[1.4,12],[1.4,15],[1.2,15]],
            'electric_rota':[1200,1500,1400,1200,1800],
        }
        serializer = PhyMonitorJBODSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_net_traffic():
    return round(random.uniform(1000, 2000), 1)

N_DATA = {
    '1': [
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
    ],
    '2': [
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
    ],
    '3': [
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
        {'link':0,'upload':0.0,'download':0.0},
    ],
    '4': []
}

class PhyMonitorNetworkList(APIView):
    def get(self, request, n_id):
        data = N_DATA[n_id]
        serializer = PhyMonitorNetworkSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_cpu_temp():
    return random.randint(41-5, 54+5)

def get_cpu_volt():
    return round(random.uniform(1.8, 1.9), 3)

def get_dimm_volt():
    return round(random.uniform(1.15, 1.25), 3)

def get_fan_speed():
    return 7000

def get_server_volt():
    return round(random.uniform(11.9, 12.2), 3)

def get_server_current():
    return round(random.uniform(1.19, 1.21), 3)

def get_phy_cpu_mem(impi_url):
    chassislist = redfish.get_chassis_list(impi_url)
    if chassislist['code'] == 200:
        chassis = chassislist['body']['Members'][0]
        cha = {
            'CPU': [],
            'memory_voltage': []
        }

        thermal = redfish.get_chassis_thermal(impi_url, chassis['@odata.id'])
        if thermal['code'] == 200:
            for temp in thermal['body']['Temperatures']:
                if 'CPU' in temp['Name']:
                    cha['CPU'].append({'T':temp['ReadingCelsius']})
        else:
            # fake data
            cha['CPU'].expend([{'T': get_cpu_temp()}, {'T': get_cpu_temp()}])

        power = redfish.get_chassis_power(impi_url, chassis['@odata.id'])
        if power['code'] == 200:
            idx = 0
            for volt in power['body']['Voltages']:
                if 'cpu' in volt['Name']:
                    cha['CPU'][idx]['V'] = volt['ReadingVolts']
                    idx += 1
                elif 'DIMM' in volt['Name']:
                    cha['memory_voltage'].extend([volt['ReadingVolts'] \
                            for i in xrange(4)])
        else:
            # fake data
            cha['CPU'][0]['V'] = get_cpu_volt()
            cha['CPU'][1]['V'] = get_cpu_volt()
            cha['memory_voltage'] = [get_dimm_volt() for i in xrange(16)]\

        return cha
    else:
        # return fake data
        return {
            'CPU': [
                {'V':get_cpu_volt(),'T':get_cpu_temp()},
                {'V':get_cpu_volt(),'T':get_cpu_temp()}
            ],
            'memory_voltage': [get_dimm_volt() for i in xrange(16)]
        }

PHY_URLs = settings.REDFISH_URL['phy_server']

class PhyMonitorServerList(APIView):
    def get(self, request):
        data = [
            {
                'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
                'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            },
            {
                'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
                'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            },
            {
                'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
                'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            },
            {
                'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
                'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            }
        ]
        # if chassislist['code'] == 200:
            
        # else:
            # return Response('Fail to get chassis list', \
                    # status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = PhyMonitorServerSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PhyMonitorStorageDetail(APIView):
    def get(self, request):
        data = {
            'nodes':[
                {
                    'id':1,
                    'cpu1':[80,70],
                    'cpu2':[60,90],
                    'memory_voltage':[10,12,12,12,12,11,11,11,11,11,12,10,10,11,10,13]
                },
                {
                    'id':1,
                    'cpu1':[88,60],
                    'cpu2':[90,100],
                    'memory_voltage':[14,11,13,12,12,11,11,11,11,11,12,10,10,11,10,13]
                }
            ],
            'disk':[
                1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,0,1,0,0,-1,
                0,1,1,1,1,1,0,0,0,-1,1,1,0,0,0,1,1,0,0,1
            ],
            'disk_status':{'-1':'no disk','0':'not assgin','1':'assigned'},
            'electric_rota':[1200,1500],
            'systemUI':[1.2,12],
            'PDU':[[220,12,1.2],[220,12,1.5]]
        }
        serializer = PhyMonitorStorageSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def __get_disk_status(self):
        poollist = storage.get_pool_list()
        if poollist['success']:
            disks_used = []
            for pool in poollist['data']:
                for disk in pool['disks']:
                    disks_used.append(disk['name'])
            jbodlist = storage.get_jbod_list()
            if jbodlist['success']:
                disk_status = []
                for jbod in jbodlist['data']:
                    for slot in jbod['slotList']:
                        if slot == 'empty':
                            disk_status.append(-1)
                        else:
                            if slot in disks_used:
                                disk_status.append(1)
                            else:
                                disk_status.append(0)
                return disk_status
            else:
                LOG.info("Get jbod list error: %s" % jbodlist['error'])
                return []
        else:
            LOG.info("Get pool list error: %s" % poollist['error'])
            return []

