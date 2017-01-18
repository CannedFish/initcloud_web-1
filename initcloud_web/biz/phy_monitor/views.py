# -*- coding: utf-8 -*-

import logging, random
import json
import os

from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from pysnmp.hlapi import *

from biz.common.pagination import PagePagination
from biz.phy_monitor.serializer import CabinetSerializer,\
        PhyMonitorJBODSerializer, PhyMonitorNetworkSerializer,\
        PhyMonitorServerSerializer, PhyMonitorStorageSerializer,\
        PhyPDUSerializer
from biz.phy_monitor.models import PhyMonitorPDU
from biz.alarm.models import Alarm_Save

from django.conf import settings

import cloud.api.redfish as redfish
import cloud.api.storage as storage
import cloud.api.warning as warning
import cloud.api.pdu as pdu

import threading
#sas import
#from surcloudextend_service.extend_service.common import config
import os,commands
#from jpype import *
import os.path  

LOG = logging.getLogger(__name__)

class Parallel(threading.Thread):
    def __init__(self, func, arg):
        super(Parallel, self).__init__()
        self._func = func
        self._arg = arg

    def run(self):
        self._func(*self._arg)

def get_jbod_current():
    """
    Get JBOD's temporary current data
    """
    return round(random.uniform(9.8, 10.2), 1)

def get_jbod_volt():
    """
    Get JBOD's temporary volt data
    """
    return round(random.uniform(219.9, 220.1), 1)

def get_jbod_fan_speed():
    """
    Get JBOD's temporary fan speed data
    """
    return random.randint(6999, 7001)

def get_jbod_data():
    """
    Get JBOD's temporary data
    """
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
            'electric_rota': [get_jbod_fan_speed() for i in xrange(5)],
            'model': settings.JBOD_MODEL['1']
        },
        '2': {
            'disk': [],
            'systemUI': [],
            'electric_rota': [],
            'model': settings.JBOD_MODEL['2']
        }
    }

class PhyMonitorJBODDetail(APIView):
    def get(self, request, j_id):
        """
        Handle get request to /api/phy_monitor_jbod/
        """
        data = get_jbod_data()[j_id]
        serializer = PhyMonitorJBODSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_net_traffic():
    """
    Get network switch's temporary traffic data
    """
    return round(random.uniform(1000, 2000), 1)

def get_net_data(no):
    """
    Get network switch's data.
    Return temporary data if simulate switch on or get data failed.
    Return real data on the other hand.
    """
    SWITCH_DATA = {
        '1': {
            'model': settings.SWITCH_MODEL['1'],
            'traffic': [
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
            'traffic_40GB': []
        },
        '2': {
            'model': settings.SWITCH_MODEL['2'],
            'traffic': [
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
            'traffic_40GB': [
                {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
                {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
                {'link':0,'upload':0.0,'download':0.0},
                {'link':0,'upload':0.0,'download':0.0}
            ]
        },
        '3': {
            'model': settings.SWITCH_MODEL['3'],
            'traffic': [
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
            'traffic_40GB': [
                {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
                {'link':1,'upload':get_net_traffic(),'download':get_net_traffic()},
                {'link':0,'upload':0.0,'download':0.0},
                {'link':0,'upload':0.0,'download':0.0}
            ]
        },
        '4': {
            'model': settings.SWITCH_MODEL['4'],
            'traffic': [],
            'traffic_40GB': []
        }
    }

    addr = settings.SWITCH_ADDR[no]
    if settings.REDFISH_SIMULATE or not addr:
        return SWITCH_DATA[no]
    else:
        try:
            # incoming traffic
            incoming = nextCmd(SnmpEngine(), \
                    CommunityData('PUBLIC'), \
                    UdpTransportTarget((addr, 161)), \
                    ContextData(), \
                    ObjectType(ObjectIdentity('IF-MIB', 'ifInOctets')))

            # outgoing traffic
            outgoing = nextCmd(SnmpEngine(), \
                    CommunityData('PUBLIC'), \
                    UdpTransportTarget((addr, 161)), \
                    ContextData(), \
                    ObjectType(ObjectIdentity('IF-MIB', 'ifOutOctets')))

            if no == '1':
                ifno, if40 = 24, 0
            else:
                ifno, if40 = 48, 4
            data = {
                'model': settings.SWITCH_MODEL[no],
                'traffic': [],
                'traffic_40GB': []
            }
            # normal port
            for i in xrange(ifno):
                errIndication, errStatus, errIdx, inVar = next(incoming)
                errIndication, errStatus, errIdx, outVar = next(outgoing)
                data['traffic'].append({
                    'link': 0 if int(inVar[0][1]) == int(outVar[0][1]) == 0 else 1,
                    'upload': round(int(inVar[0][1])/1024.0, 1),
                    'download': round(int(outVar[0][1])/1024.0, 1)
                })
            # 40GB port
            for i in xrange(if40):
                errIndication, errStatus, errIdx, inVar = next(incoming)
                errIndication, errStatus, errIdx, outVar = next(outgoing)
                data['traffic_40GB'].append({
                    'link': 0 if int(inVar[0][1]) == int(outVar[0][1]) == 0 else 1,
                    'upload': round(int(inVar[0][1])/1024.0, 1),
                    'download': round(int(outVar[0][1])/1024.0, 1)
                })

            return data
        except Exception, e:
            LOG.info(e)
            return SWITCH_DATA[no]
        
class PhyMonitorNetworkList(APIView):
    def get(self, request, n_id):
        """
        Handle get request to /api/phy_monitor_network/$n_id
        """
        data = get_net_data(n_id)
        serializer = PhyMonitorNetworkSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

def check_and_warn(data, th_max, th_min, meter, name, count, ip):
    """
    Check threshold and send warning message if necessary.

    @params
    data: data to be checked
    th_max: the maximum of this kind of data
    th_min: the minimum of this kind of data
    meter: the type of data
    name: the name of this kind of warning
    count: the time of this kind of warning happen
    ip: IP of the illed node
    """
    if data > th_max:
        meter += '_max'
    elif data < th_min:
        meter += '_min'
    else:
        return
    content = settings.REQ_CONTENT_FMT % (name, meter, str(data), count)
    warning.warn(name, meter, content, count, ip)

def get_cpu_temp():
    """
    Get CPU's temporary temperature data
    """
    return random.randint(41-5, 54+5)

def get_cpu_volt():
    """
    Get CPU's temporary volt data
    """
    return round(random.uniform(1.8, 1.9), 2)

def get_dimm_volt():
    """
    Get DIMM's temporary volt data
    """
    return round(random.uniform(1.15, 1.25), 2)

def get_fan_speed():
    """
    Get compute nodes' temporary fan speed data
    """
    return random.randint(6999, 7001)

def get_server_volt():
    """
    Get compute nodes' temporary volt data
    """
    return round(random.uniform(11.9, 12.2), 2)

def get_server_current():
    """
    Get compute nodes' temporary current data
    """
    return round(random.uniform(1.19, 1.21), 2)

def get_fake_cpu_mem():
    """
    Get compute nodes' temporary data
    """
    return {
        'CPU': [
            {'V':get_cpu_volt(),'T':get_cpu_temp()},
            {'V':get_cpu_volt(),'T':get_cpu_temp()}
        ],
        'memory_voltage': [get_dimm_volt() for i in xrange(16)],
        'fan_speed': [get_fan_speed() for i in xrange(2)],
        'PDU': {
            'volt': get_pdu_volt(),
            'current': get_pdu_current(),
            'watt': get_pdu_watt()
        }
    }

def get_phy_cpu_mem(impi_url):
    """
    Get compute nodes' real data.
    If failed will return temporary data.
    """
    chassislist = redfish.get_chassis_list(impi_url)
    if chassislist['code'] == 200:
        chassis = chassislist['body']['Members'][0]
        cha = {
            'CPU': [],
            'memory_voltage': [],
            'fan_speed': [get_fan_speed() for i in xrange(2)],
            'PDU': {
                'volt': get_pdu_volt(),
                'current': get_pdu_current(),
                'watt': get_pdu_watt()
            }
        }

        thermal = redfish.get_chassis_thermal(impi_url, chassis['@odata.id'])
        if thermal['code'] == 200:
            # get temperatures
            for temp in thermal['body']['Temperatures']:
                if 'CPU' in temp['Name']:
                    cha['CPU'].append({'T':temp['ReadingCelsius']})
            # get fan speed
            cha['fan_speed'] = [thermal['body']['Fans'][i]['Reading'] \
                    for i in xrange(2)] # unit RPM
        else:
            # fake data
            cha['CPU'].expend([{'T': get_cpu_temp()}, {'T': get_cpu_temp()}])

        power = redfish.get_chassis_power(impi_url, chassis['@odata.id'])
        if power['code'] == 200:
            # get CPU's and DIMM's power
            idx = 0
            for volt in power['body']['Voltages']:
                if 'cpu' in volt['Name']:
                    cha['CPU'][idx]['V'] = volt['ReadingVolts']
                    idx += 1
                elif 'DIMM' in volt['Name']:
                    cha['memory_voltage'].extend([volt['ReadingVolts'] \
                            for i in xrange(4)])
            # get PDU's power
            cha['PDU']['volt'] = power['body']['PowerSupplies'][0]['LineInputVoltage']
            cha['PDU']['watt'] = power['body']['PowerControl'][0]['PowerConsumedWatts']
        else:
            # fake data
            cha['CPU'][0]['V'] = get_cpu_volt()
            cha['CPU'][1]['V'] = get_cpu_volt()
            cha['memory_voltage'] = [get_dimm_volt() for i in xrange(16)]\

        return cha
    else:
        # return fake data
        return get_fake_cpu_mem()

def cpu_mem_work(res, idx, t_url):
    res[idx] = get_phy_cpu_mem(t_url)

PHY_URLs = settings.REDFISH_URL['phy_server']

class PhyMonitorServerList(APIView):
    def get(self, request, s_id):
        """
        Handle get request to /api/phy_monitor_server/$s_id
        """
        nodes = [None] * len(PHY_URLs[s_id])
        if settings.REDFISH_SIMULATE:
            nodes = [get_fake_cpu_mem() if r_url != None else None \
                    for r_url in PHY_URLs[s_id]]
        else:
            th = []
            for r_url, i in zip(PHY_URLs[s_id], range(len(PHY_URLs[s_id]))):
                # make parallelization
                if r_url != None:
                    t = Parallel(cpu_mem_work, (nodes, i, r_url))
                    t.start()
                    th.append(t)
                # nodes.append(get_phy_cpu_mem(r_url) if r_url != None else None)
            for t in th:
                t.join()

        self._check_and_warn(nodes, s_id)
        data = {
            'model': settings.SERVER_MODEL[s_id],
            'nodes': nodes
        }
        serializer = PhyMonitorServerSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _check_and_warn(self, data, s_id):
        """
        Check server's threashold and send warning message if necessary.
        """
        thres = settings.PHY_THRES['phy'][s_id]
        name = '物理服务器%s报警' % s_id
        for node, idx in zip(data, range(4)):
            if node == None:
                continue
            for cpu in node['CPU']:
                # temp
                check_and_warn(cpu['T'], thres['cpu_temp_max'], \
                        thres['cpu_temp_min'], 'cpu_temp', name, \
                        1, thres['ip'][idx])
                # volt
                check_and_warn(cpu['V'], thres['cpu_volt_max'], \
                        thres['cpu_volt_min'], 'cpu_volt', name, \
                        1, thres['ip'][idx])
            for mem in node['memory_voltage']:
                # volt
                check_and_warn(mem, thres['mem_volt_max'], \
                        thres['mem_volt_min'], 'mem_volt', name, \
                        1, thres['ip'][idx])

S_URL = settings.REDFISH_URL['storage_server']

def get_pdu_volt():
    """
    Get PDU's temporary volt data
    """
    return round(random.uniform(219.8, 220.2), 2)

def get_pdu_current():
    """
    Get PDU's temporary current data
    """
    return round(random.uniform(11.8, 12.2), 2)

def get_pdu_watt():
    """
    Get PDU's temporary watt data
    """
    return random.randint(92-2, 92+2)

def get_storage_data():
    """
    Get storage server's temporary data.
    Return temporary data if get data failed or simulate on.
    Return real data on the other hand.
    """
    ssbs = [None, None]
    if settings.REDFISH_SIMULATE:
        ssbs = [get_fake_cpu_mem() for i in xrange(2)]
    else:
        th = []
        for ssb, i in zip(S_URL, range(2)):
            # make parallization
            t = Parallel(cpu_mem_work, (ssbs, i, ssb))
            t.start()
            th.append(t)
            # ssbs.append(get_phy_cpu_mem(ssb))
        for t in th:
            t.join()
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
        'electric_rota': [ssbs[i]['fan_speed'] for i in xrange(2)],
        'systemUI':[get_server_current(), get_server_volt()],
        'PDU':[[ssbs[i]['PDU']['volt'], ssbs[i]['PDU']['current'], ssbs[i]['PDU']['watt']] \
                for i in xrange(2)],
        'model': settings.STORAGE_MODEL
    }

class PhyMonitorStorageDetail(APIView):
    def get(self, request):
        """
        Handle get request to /api/phy_monitor_storage/
        """
        data = get_storage_data()
        if not settings.REDFISH_SIMULATE:
            disks = self.__get_disk_status()
            data['disk'] = disks if len(disks) != 0 else data['disk']
        self._check_and_warn(data['nodes'])
        serializer = PhyMonitorStorageSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _check_and_warn(self, data):
        """
        Check storage server's threashold and send warning message
        if necessary.
        """
        thres = settings.PHY_THRES['store']
        name = '存储服务器%d报警'
        for node, th, num in zip(data, thres, [1, 2]):
            # cpu
            for cpu in ['cpu1', 'cpu2']:
                check_and_warn(node[cpu][0], th['cpu_temp_max'], \
                        th['cpu_temp_min'], 'cpu_temp', name % num, \
                        1, th['ip'])
                check_and_warn(node[cpu][1], th['cpu_volt_max'], \
                        th['cpu_volt_min'], 'cpu_volt', name % num, \
                        1, th['ip'])
            # mem
            for mem in node['memory_voltage']:
                check_and_warn(mem, th['mem_volt_max'], \
                        th['mem_volt_min'], 'mem_volt', name % num, \
                        1, th['ip'])

    def __get_disk_status(self):
        """
        Get the utilizition status of disk pool
        """
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
    """
    Get all computer nodes' CPU temperature.
    Return temporary data if get data failed or simulate on.
    Return real data on the other hand.
    """
    c_temps = []
    for phys in '12345':
        # TODO: make parallelization
        cpus = {'node1':[],'node2':[],'node3':[],'node4':[]}
        idx = 1
        for impi_url in PHY_URLs[phys]:
            if impi_url != None:
                # TODO: make parallelization
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


def getsasportinfo(self,ip,name,pw):
    telnetjava = JClass("sasSwitch.telnetjava")
    telnet=telnetjava("VT220",">")
    telnet.login(ip,23, name, pw)
    infos=telnet.sendCommand('show phy')
    telnet.distinct();
        
    strsper="------------------------------------- ------------------------------------------\n"
    pos1=infos.find(strsper);
    perlinelength=len(strsper)
    pos1+=perlinelength;
       
    strtemp="";
    ret=''
    bfrist=True;
    for i in range(0,64,4):
        
        pos2=infos.find('\n', pos1);
        strtemp=infos[pos1: pos2];
        pos1=pos2+1+3*perlinelength;
        posfind=strtemp.find("End");
        if( -1 != posfind):
          
            strportnumber="port:"
            port111=i/4+1
            strportnumber+=str(port111)
            		
            if(not  bfrist):
                ret+=";"
            	
            bfrist=False
            ret+=strportnumber

    return ret
            


class SASDetail(APIView):
    jarpath = '/usr/lib/python2.7/site-packages/surcloudextend_service/extend_service/libjava/'
    args=("-Djava.class.path=%s:" % (jarpath + 'sasSwitchpack.jar')) 
    args+=("%s" % (jarpath + 'commons-net-2.0.jar'))
    #javabasepath=getDefaultJVMPath()
    #startJVM(javabasepath,"-ea", args)
    def get(self, request):
        return_val = 1
        LOG.info("sas_manager.request_handle")
        try:
            #method=gui_req['method']
            method = "sas_getport"
            if 'sas_getport' == method:
                sas_ip = settings.SAS_SWITCH_IP
                sas_usr = settings.SAS_SWITCH_USER
                sas_password = settings.SAS_SWITCH_PASS
                try:
                    sas_protsinfo=getsasportinfo(sas_ip,sas_usr,sas_password)
                    response_data={}
                    response_data['sas_ports']=sas_protsinfo
                    response_message='get sasswitch succesful'
                    response = [{'status_code': return_val, "message": "get sas switch done.", "method": method,                     "data": {"sas_ports":sas_protsinfo}}]
                    return response 
                except Exception as exc1:
                    LOG.info("connect sas_switch faild%d" % exc1)
                    response_data={}
                    response_data['sas_ports']=''
                    response_message='connect sasswitch failed'
                    return_val=0
                    response = [{'status_code': return_val, "message": "get sas switch failed.", "method": method,                     "data": {"sas_ports":''}}]
                    return response

        except Exception as exc:
            LOG.info("sasManager.request_handle_exception%d" % exc)
            return [] 



class CabinetDetail(APIView):
    def get(self, request):
        """
        Handle get request to /api/cabinet/
        """
        N_DATA = {
            '1': get_net_data('1'),
            '2': get_net_data('2'),
            '3': get_net_data('3'),
            '4': get_net_data('4')
        }
        J_DATA = get_jbod_data()
        SS_DATA = get_storage_data()
        data = {
            '_24switchboard':[[net['link'] for net in N_DATA['1']['traffic']] \
                    , [net['link'] for net in N_DATA['1']['traffic_40GB']]],
            '_48switchboard_01':[[net['link'] for net in N_DATA['2']['traffic']] \
                    , [net['link'] for net in N_DATA['2']['traffic_40GB']]],
            '_48switchboard_02':[[net['link'] for net in N_DATA['3']['traffic']] \
                    , [net['link'] for net in N_DATA['3']['traffic_40GB']]],
            '_48switchboard_03':[[net['link'] for net in N_DATA['4']['traffic']] \
                    , [net['link'] for net in N_DATA['4']['traffic_40GB']]],
            'cpu_temperature': get_cpu_temperatures(),
            'jbod_status_01': J_DATA['1']['disk'],
            'jbod_status_02': J_DATA['2']['disk'],
            'memory_server_status_01': SS_DATA['disk'][0:20],
            'memory_server_status_02': SS_DATA['disk'][20:40],
            'ssb_cpu_temp': [
                [SS_DATA['nodes'][0]['cpu1'][0], SS_DATA['nodes'][0]['cpu2'][0]],
                [SS_DATA['nodes'][1]['cpu1'][0], SS_DATA['nodes'][1]['cpu2'][0]]
            ]
        }
        serializer = CabinetSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AlarmDetail(APIView):
    def get(self, request):
        LOG.info(" begin to triger alarm ")
        nodes = settings.ALARM_NODES
        for type_node,values in nodes.items():
            LOG.info("node type is" + str(type_node))
            LOG.info(" values are " + str(values))
            for key,value in values.items():
                LOG.info(" key is " + str(key))
                LOG.info(" value is " + str(value))
                ip = str(value)
                response = self._check_status(ip)
                nodes[type_node][key] = response
        return Response(nodes)

    def _check_status(self, ip):
        # 0 ok
        # 1 alarm
        # -1 error
        LOG.info(" start to check status ")
        response = 0
        if '.' not in str(ip):
            response = 0
        else:
            response = os.system("ping -c 1 " + ip)    
        LOG.info(response)
        if response == 0:
            LOG.info("0")
            alarm_save = Alarm_Save.objects.filter(alarm_name=ip)
            if alarm_save:
                response = 1
        else:
            LOG.info("-1")
            response = -1
        return response
    
class PhyMonitorDisplayDetail(APIView):
    def get(self, request):
        """
        Handle get request to /api/phy_monitor_display/
        """
        data = None
        LOG.info(" start to read file ")
        with open('/opt/display.json', 'r') as f:
            LOG.info(" read data done ")
            data = json.load(f)
        LOG.info(" data is " + str(data))
        return Response(data)


class PhyMonitorPDUDetail(APIView):
    def __create_or_update(self, queryset, pdu, volt, current, watt):
        """
        Update PDU's data or create a new data if less than 4 has been stored
        """
        if len(queryset) < 4:
            PhyMonitorPDU(name=pdu, volt=volt, current=current,\
                    watt=watt).save()
        else:
            oldest = queryset[0]
            oldest.volt = volt
            oldest.current = current
            oldest.watt = watt
            oldest.save()

    def __pdu_data_init(self, dlist):
        """
        Initialize data value of PDU
        """
        ret = {
            'currentdata': dlist,
            'data': {
                'voltdata': [[i, 0.0] for i in xrange(4)],
                'currentdata': [[i, 0.0] for i in xrange(4)],
                'wattdata': [[i, 0.0] for i in xrange(4)]
            }
        }
        ret['data']['voltdata'].append([4, dlist[0]])
        ret['data']['currentdata'].append([4, dlist[1]])
        ret['data']['wattdata'].append([4, dlist[2]])
        return ret

    def __pdu_data_assign(self, data, key, dlist):
        """
        Assign PDU's data to the set to be returned
        """
        idx = 4-len(dlist)
        for d in dlist:
            data[key]['data']['voltdata'][idx][1] = d.volt
            data[key]['data']['currentdata'][idx][1] = d.current
            data[key]['data']['wattdata'][idx][1] = d.watt
            idx += 1

    def get(self, request):
        """
        Handle get request to /api/phy_monitor_pdu/
        """
        # data = {
            # 'PDU1':{
                # 'currentdata':[123.12,45.12,258.12],
                # 'data':{
                    # 'voltdata':[[0,4.81],[1,7.31],[2,6.55],[3,2.15],[4,3.76]],
                    # 'currentdata':[[0,4.81],[1,7.31],[2,7.55],[3,6.35],[4,3.76]],
                    # 'wattdata':[[0,4.81],[1,7.31],[2,6.55],[3,2.15],[4,3.76]]
                # }
            # },
            # 'PDU2':{
                # 'currentdata':[124.12,46.12,259.12],
                # 'data':{
                    # 'voltdata':[[0,4.81],[1,7.31],[2,6.55],[3,5.15],[4,3.76]],
                    # 'currentdata':[[0,2.81],[1,7.31],[2,2.55],[3,4.15],[4,4.76]],
                    # 'wattdata':[[0,1.81],[1,7.38],[2,8.55],[3,2.15],[4,5.16]]
                # }
            # },
        # }
        # PDU1
        p1_now = [get_pdu_volt(),get_pdu_current(),random.randint(1100-100, 1100+100)]
        p1_last4 = PhyMonitorPDU.last4('PDU1')
        # PDU2
        p2_now = [get_pdu_volt(),get_pdu_current(),random.randint(1100-100, 1100+100)]
        p2_last4 = PhyMonitorPDU.last4('PDU2')
        if not settings.REDFISH_SIMULATE:
            pdu_data = pdu.get_pdu_input()
            if len(pdu_data) > 0:
                p1_now = [pdu_data[0]['U'], pdu_data[0]['I'], pdu_data[0]['P']]
                p2_now = [pdu_data[1]['U'], pdu_data[1]['I'], pdu_data[1]['P']]
                print p1_now, p2_now
        # Generate data
        data = {
            'PDU1': self.__pdu_data_init(p1_now),
            'PDU2': self.__pdu_data_init(p2_now)
        }
        self.__pdu_data_assign(data, 'PDU1', p1_last4)
        self.__pdu_data_assign(data, 'PDU2', p2_last4)
        # Update database
        self.__create_or_update(p1_last4, 'PDU1', p1_now[0], \
                p1_now[1], p1_now[2])
        self.__create_or_update(p2_last4, 'PDU2', p2_now[0], \
                p2_now[1], p2_now[2])

        # check pdu output and warn if necessary
        for l_pdu, outlets in zip(range(len(settings.PDU_OUTPUT_MONITOR)), \
                settings.PDU_OUTPUT_MONITOR):
            if len(outlets) > 0:
                l_status = pdu.get_pdu_output_status(l_pdu, outlets)
                # send warn message
                for k in l_status:
                    if not l_status[k]:
                        warning.warn("PDU output", "No output current", \
                                "--", 1, "outlet%d" % k)

        serializer = PhyPDUSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

