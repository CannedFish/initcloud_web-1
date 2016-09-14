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

def get_jbod_current():
    return round(random.uniform(9.8, 10.2), 1)

def get_jbod_volt():
    return round(random.uniform(219.9, 220.1), 1)

def get_jbod_fan_speed():
    return random.randint(6999, 7001)

def get_jbod_data():
    return {
        '1': {
            'disk': [
                1,1,1,1,1,1,0,0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                1,1,1,0,0,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                1,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                1,1,0,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                1,0,1,1,1,0,0,0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
            ],
            'systemUI': [[get_jbod_current(), get_jbod_volt()] for i in xrange(4)],
            'electric_rota': [get_jbod_fan_speed() for i in xrange(5)]
        },
        '2': {
            'disk': [],
            'systemUI': [],
            'electric_rota': []
        }
    }

class PhyMonitorJBODDetail(APIView):
    def get(self, request, j_id):
        data = get_jbod_data()[j_id]
        serializer = PhyMonitorJBODSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_net_traffic():
    return round(random.uniform(1000, 2000), 1)

def get_net_data():
    return {
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
        data = get_net_data()[n_id]
        serializer = PhyMonitorNetworkSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_cpu_temp():
    return random.randint(41-5, 54+5)

def get_cpu_volt():
    return round(random.uniform(1.8, 1.9), 2)

def get_dimm_volt():
    return round(random.uniform(1.15, 1.25), 2)

def get_fan_speed():
    return random.randint(6999, 7001)

def get_server_volt():
    return round(random.uniform(11.9, 12.2), 2)

def get_server_current():
    return round(random.uniform(1.19, 1.21), 2)

def get_fake_cpu_mem():
    return {
        'CPU': [
            {'V':get_cpu_volt(),'T':get_cpu_temp()},
            {'V':get_cpu_volt(),'T':get_cpu_temp()}
        ],
        'memory_voltage': [get_dimm_volt() for i in xrange(16)]
    }

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
        return get_fake_cpu_mem()

PHY_URLs = settings.REDFISH_URL['phy_server']

class PhyMonitorServerList(APIView):
    def get(self, request, s_id):
        data = [
            # {
            #     'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
            #     'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            # },
            # {
            #     'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
            #     'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            # },
            # {
            #     'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
            #     'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            # },
            # {
            #     'CPU':[{'V':'12','T':'80'},{'V':'14','T':'70'}],
            #     'memory_voltage':[12,12,12,12,12,12,12,13,14,15,16,17,18,19,12,11]
            # }
        ]
        if settings.REDFISH_SIMULATE:
            data = [get_fake_cpu_mem() for i in xrange(4)]
        else:
            for r_url in PHY_URLs[s_id]:
                data.append(get_phy_cpu_mem(r_url))
        serializer = PhyMonitorServerSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

S_URL = settings.REDFISH_URL['storage_server']

def get_pdu_volt():
    return round(random.uniform(219.8, 220.2), 2)

def get_pdu_current():
    return round(random.uniform(11.8, 12.2), 2)

def get_pdu_watt():
    return random.randint(92-2, 92+2)

def get_storage_data():
    ssbs = []
    if settings.REDFISH_SIMULATE:
        ssbs = [get_fake_cpu_mem() for i in xrange(2)]
    else:
        for ssb in S_URL:
            ssbs.append(get_phy_cpu_mem(ssb))
    return {
        'nodes': [
            {
                'id': 1,
                'cpu1': [ssbs[0]['CPU'][0]['T'], ssbs[0]['CPU'][0]['V']],
                'cpu2': [ssbs[0]['CPU'][1]['T'], ssbs[0]['CPU'][1]['V']],
                'memory_voltage': ssbs[0]['memory_voltage']
            },
            {
                'id': 2,
                'cpu1': [ssbs[1]['CPU'][0]['T'], ssbs[1]['CPU'][0]['V']],
                'cpu2': [ssbs[1]['CPU'][1]['T'], ssbs[1]['CPU'][1]['V']],
                'memory_voltage': ssbs[1]['memory_voltage']
            }
        ],
        'disk': [
            1,1,0,1,1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
        ],
        'disk_status': {'-1':'no disk','0':'not assgin','1':'assigned'},
        'electric_rota': [get_fan_speed() for i in xrange(2)],
        'systemUI':[get_server_current(), get_server_volt()],
        'PDU':[[get_pdu_volt(), get_pdu_current(), get_pdu_watt()] \
                for i in xrange(2)]
    }

class PhyMonitorStorageDetail(APIView):
    def get(self, request):
        data = get_storage_data()
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

def get_cpu_temperatures():
    c_temps = []
    for phys in '12345':
        cpus = {'node1':[],'node2':[],'node3':[],'node4':[]}
        idx = 1
        for impi_url in PHY_URLs[phys]:
            if settings.REDFISH_SIMULATE:
                cpus['node%d' % idx] = [round(get_cpu_temp()), round(get_cpu_temp())]
            else:
                chassislist = redfish.get_chassis_list(impi_url)
                t = []
                if chassislist['code'] == 200:
                    chassis = chassislist['body']['Members'][0]
                    thermal = redfish.get_chassis_thermal(impi_url, chassis['@odata.id'])
                    if thermal['code'] == 200:
                        for temp in thermal['body']['Temperatures']:
                            if 'CPU' in temp['Name']:
                                t.append(round(temp['ReadingCelsius']))
                    else:
                        # fake data
                        t.extend([round(get_cpu_temp()), round(get_cpu_temp())])
                else:
                    # fake data
                    t.extend([round(get_cpu_temp()), round(get_cpu_temp())])
                cpus['node%d' % idx] = t
            idx += 1
        c_temps.append(cpus)
    return c_temps

class CabinetDetail(APIView):
    def get(self, request):
        N_DATA = get_net_data()
        J_DATA = get_jbod_data()
        SS_DATA = get_storage_data()
        data = {
            '_24switchboard':[net['link'] for net in N_DATA['1']],
            '_48switchboard_01':[net['link'] for net in N_DATA['2']],
            '_48switchboard_02':[net['link'] for net in N_DATA['3']],
            '_48switchboard_03':[net['link'] for net in N_DATA['4']],
            'cpu_temperature': get_cpu_temperatures(),
            'jbod_status_01': J_DATA['1']['disk'],
            'jbod_status_02': J_DATA['2']['disk'],
            'memory_server_status_01': SS_DATA['disk'][0:20],
            'memory_server_status_02': SS_DATA['disk'][20:40]
        }
        serializer = CabinetSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

