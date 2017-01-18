# -*- coding: utf-8 -*-
import logging, random, time

from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status

from biz.common.pagination import PagePagination
from biz.storage_monitor.serializer import StorageNodeSerializer, TreeNodeSerializer,\
        StorageBarSerializer, PhyNodesSerializer
from biz.storage_monitor.models import PhyNodesIO

import cloud.api.storage as storage
import cloud.api.warning as warning

from django.conf import settings

LOG = logging.getLogger(__name__)


def byte_2_gbyte(val):
    """
    Convert byte to gigabyte
    """
    return round(val/1024.0/1024.0/1024.0)

def byte_2_kbit(val):
    """
    Convert byte to kilobit
    """
    return round(val/1024.0*8)

def get_cpu_used():
    """
    Get temporary data of CPU utilizition
    """
    return round(random.uniform(2, 65), 1)

def get_cpu_frequence():
    """
    Get temporary data of CPU frequence
    """
    return round(random.uniform(2.6, 2.7), 1)

def get_mem_used():
    """
    Get temporary data of memory utilizition
    """
    return round(random.uniform(2, 80), 1)

def get_mem_total():
    """
    Get temporary data of total memory size
    """
    return 197

def get_rx_per():
    """
    Get temporary data of rx
    """
    return round(random.uniform(0, 90), 1)

def get_tx_per():
    """
    Get temporary data of tx
    """
    return round(random.uniform(0, 90), 1)

def get_max_rate():
    """
    Get temporary data of max rate
    """
    return 1024*1024

def get_storage_node_data(name):
    """
    Get temporary data of storage data
    """
    mem_used = get_mem_used()
    mem_total = get_mem_total()
    used = round(mem_total*mem_used/100)
    rx_per = get_rx_per()
    tx_per = get_tx_per()
    max_rate = get_max_rate()
    return {
        'name': name,
        'item': {
            'cpu_used': [get_cpu_used() for i in xrange(2)],
            'cpu_frequence': [get_cpu_frequence() for i in xrange(2)],
            'memory': {
                'memory_used': mem_used,
                'memory_total': mem_total,
                'used': used,
                'empty': mem_total-used 
            },
            'network_card': {
                'up': tx_per,
                'up_rate': max_rate*tx_per,
                'down': rx_per,
                'down_rate': max_rate*rx_per
            }
        }
    }

def get_net_data(status):
    """
    Convert data of network interface
    """
    for net in status['netIntfStatus']:
        net['rxRate'] = byte_2_kbit(net['rxRate'])
        net['txRate'] = byte_2_kbit(net['txRate'])
    nets_rx_rate = [net['rxRate'] for net in status['netIntfStatus']]
    nets_rx_per = [net['rxPer'] for net in status['netIntfStatus']]
    nets_tx_rate = [net['txRate'] for net in status['netIntfStatus']]
    nets_tx_per = [net['txPer'] for net in status['netIntfStatus']]
    # real data
    up = round(reduce(lambda x,y: x+y, nets_tx_per)/float(len(nets_tx_per)), 1)
    up_rate = reduce(lambda x,y: x+y, nets_tx_rate)
    down = round(reduce(lambda x,y: x+y, nets_rx_per)/float(len(nets_rx_per)), 1)
    down_rate = reduce(lambda x,y: x+y, nets_rx_rate)
    return up, up_rate, down, down_rate

class StorageNodeList(generics.ListAPIView):
    serializer_class = StorageNodeSerializer
    pagination_class = PagePagination
    
    def get_queryset(self):
        """
        Handle get request to /api/storage_monitor/
        """
        clusterlist = storage.get_cluster_list()
        if clusterlist['success']:
            queryset = []
            # temp
            if len(clusterlist['data']) == 1:
                clusterlist['data'].append({'hostname':'storagesbb2', 'id':'storagesbb2'})
            # temp end
            for server in clusterlist['data']:
                EmptyData = get_storage_node_data(server['hostname'])
                serverstatus = storage.get_server_status(server['id'])
                if serverstatus['success']:
                    status = serverstatus['data']
                    if status['status'] != 'offline':
                        # unit conversion
                        status['memUsed'] = byte_2_gbyte(status['memUsed'])
                        status['memTotal'] = byte_2_gbyte(status['memTotal'])
                        up, up_rate, down, down_rate = get_net_data(status)
                        # tempral data
                        max_rate = get_max_rate()
                        rx_per = get_rx_per()
                        tx_per = get_tx_per()
                        # constructs data
                        query = {
                            'name': server['hostname'],
                            'item': {
                                'cpu_used': [round(status['cpu'], 1), round(status['cpu']+random.uniform(-1, 1), 1)],
                                'cpu_frequence': [get_cpu_frequence(), get_cpu_frequence()] \
                                        if status['cpuClock']=='' \
                                        else [float(status['cpuClock'][0:-3])/1000.0, \
                                        get_cpu_frequence()],
                                'memory': {
                                    'memory_used': round(status['memUsed']\
                                            /float(status['memTotal'])*100, 1) \
                                            if status['memTotal']!=0 else 0,
                                    'memory_total': status['memTotal'],
                                    'used': status['memUsed'],
                                    'empty': status['memTotal']-status['memUsed']
                                },
                                'network_card': {
                                    'up': up, # if up != 0 else tx_per,
                                    'up_rate': up_rate, # if up != 0 else max_rate*tx_per,
                                    'down': down, # if down != 0 else rx_per,
                                    'down_rate': down_rate # if down != 0 else max_rate*rx_per
                                }
                            }
                        }
                    else:
                        query = EmptyData
                else:
                    LOG.info("Get %s status error: %s" % \
                            (server['hostname'], serverstatus['error']))
                    query = EmptyData
                queryset.append(query)
            return queryset
        else:
            LOG.info("Get cluster list error: %s" % clusterlist['error'])
            return [get_storage_node_data(n) for n in ['storage10', 'storage20']]

def get_node_list():
    """
    Get temporary data of node list
    """
    return [{
        'label': 'md10',
        'data': {
            'status': 'online',
            'description': 'md_raid'
        },
        'children': [{
            'label': 'JBOD_5003048001aeff_f_phy20',
            'data': {'status': 'online'}
        }, {
            'label': 'JBOD_5003048001aeff_f_phy19',
            'data': {'status': 'online'}
        }]
    }]

def get_tree_node_data(s_id):
    """
    Get temporary data of tree node
    """
    return {
        'label': s_id,
        'nodelist': get_node_list()
    }

class TreeNodeList(generics.ListAPIView):
    serializer_class = TreeNodeSerializer
    pagination_class = PagePagination

    def get_queryset(self):
        """
        Handle get request to /api/treeview/
        """
        poolstatus = storage.get_pool_status()
        if poolstatus['success']:
            serverlist = storage.get_cluster_alive()
            if serverlist['success']:
                # temp
                if len(serverlist['data']) == 1:
                    serverlist['data'].append({'id':'storagesbb2', 'status':'offline'})
                # temp end
                queryset = [{\
                    'label': server['id'],\
                    'nodelist': [{\
                        'label': pool['id'],\
                        'data': {\
                            'status': pool['status'],\
                            'description': pool['description'],\
                        },\
                        'children': [{\
                            'label': disk['name'],\
                            'data': {'status': disk['state']}\
                        } for disk in pool['diskList']]\
                    } for pool in filter(lambda x: x['serverId']==server['id'], poolstatus['data'])] \
                    if server['status'] == 'online' else get_node_list()\
                } for server in serverlist['data']]
            else:
                LOG.info("Get cluster alive error: %s" % serverlist['error'])
                queryset = [get_tree_node_data(s_id) for s_id in ['storage10', 'storage20']]
            return queryset
        else:
            LOG.info("Get pool status error: %s" % poolstatus['error'])
            return [get_tree_node_data(s_id) for s_id in ['storage10', 'storage20']]

class StorageBarDetail(APIView):
    def get(self, request):
        """
        Handle get request to /api/storage__bar/
        """
        disklist = storage.get_disk_list()
        storage_bar = {'disk':[4,3], 'SSD':[0,0], 'NVMe':[4,3], 'SAS': [0,0]}
        if disklist['success']:
            dl = disklist['data']
            # used
            poollist = storage.get_pool_list()
            if poollist['success']:
                disks_used = []
                for pool in poollist['data']:
                    for disk in pool['disks']:
                        disks_used.append(disk['name'])
                # total
                disk_used, disk_total = 0, len(dl)
                ssd, nvme, sas = ssd_total, nvme_total, sas_total = 0, 0, 0
                for disk in dl:
                    if disk['id'] in disks_used:
                        used = True
                        disk_used += 1
                    else:
                        used = False
                    for flag in disk['flags']:
                        if flag == 'ssd':
                            ssd_total += 1
                            if used:
                                ssd += 1
                        elif flag == 'sas':
                            sas_total += 1
                            if used:
                                sas += 1
                        elif flag == 'nvme':
                            nvme_total += 1
                            if used:
                                nvme += 1
                        else:
                            continue
                sas_empty = 0
                jbodlist = storage.get_jbod_list()
                if jbodlist['success']:
                    for jbod in jbodlist['data']:
                        for slot in jbod['slotList']:
                            if slot == 'empty':
                                sas_empty += 1
                storage_bar = {
                    'disk': [disk_used, disk_total-disk_used],
                    'SSD': [ssd, ssd_total-ssd],
                    'NVMe': [nvme, nvme_total-nvme],
                    'SAS': [sas, sas_empty]
                }
            else:
                LOG.info("Get pool list error: %s" % poollist['error'])
            # serializer = StorageBarSerializer(storage_bar)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            LOG.info("Get disk list error: %s" % disklist['error'])
            # return Response(disklist['error'], status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = StorageBarSerializer(storage_bar)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_read_speed():
    """
    Get temporary data of read speed
    """
    return [[t, random.randint(0, 1000)] for t in range(25)[::-1]]

def get_write_speed():
    """
    Get temporary data of write speed
    """
    return [[t, random.randint(0, 1000)] for t in range(25)[::-1]]

def get_phy_node():
    """
    Get temporary data of storage node
    """
    return {
        'sbb': get_phy_sbb(),
        'io': get_phy_io()
    }

def get_phy_sbb():
    """
    Get temporary data of SBB
    """
    return {
        'cpuUsed': get_cpu_used(),
        'memUsed': get_mem_used(),
        'rx': get_rx_per(),
        'tx': get_tx_per(),
        'datatype': 'SBB'
    }

def get_phy_io():
    """
    Get temporary data of IO
    """
    return {
        'updatapackage': get_read_speed(),
        'downdatapackage': get_write_speed(),
        'datatype': 'IO'
    }

class PhyNodesList(APIView):
    def get(self, request):
        """
        Handle get request to /api/phy_nodes/

        nodes = [
            {
                'sbb': {
                    'cpuUsed': 70,
                    'memUsed': 10,
                    'rx': 85,
                    'tx': 100,
                    'datatype': 'SBB'
                },
                'io': {
                    'updatapackage': [[24, 661], [23, 554], [22, 348], [21, 780], \
                            [20, 636], [19, 727], [18, 646], [17, 646], [16, 899], \
                            [15, 780], [14, 351], [13, 582], [12, 437], [11, 765], \
                            [10, 667], [9, 832], [8, 517], [7, 679], [6, 564], \
                            [5, 238], [4, 456], [3, 803], [2, 457], [1, 745], [0, 771]],
                    'downdatapackage': [[24, 641], [23, 669], [22, 417], [21, 651], \
                            [20, 931], [19, 112], [18, 145], [17, 382], [16, 230], \
                            [15, 706], [14, 497], [13, 688], [12, 131], [11, 619], \
                            [10, 464], [9, 893], [8, 225], [7, 634], [6, 631], \
                            [5, 196], [4, 935], [3, 577], [2, 244], [1, 179], [0, 645]]
                    'datatype': 'IO'
                }
            },
            {
                'sbb': {
                    'cpuUsed': 75,
                    'memUsed': 30,
                    'rx': 95,
                    'tx': 60,
                    'datatype': 'SBB'
                },
                'io': {
                    'updatapackage': [[24, 661], [23, 554], [22, 348], [21, 780], \
                            [20, 636], [19, 727], [18, 646], [17, 646], [16, 899], \
                            [15, 780], [14, 351], [13, 582], [12, 437], [11, 765], \
                            [10, 667], [9, 832], [8, 517], [7, 679], [6, 564], \
                            [5, 238], [4, 456], [3, 803], [2, 457], [1, 745], [0, 771]],
                    'downdatapackage': [[24, 641], [23, 669], [22, 417], [21, 651], \
                            [20, 931], [19, 112], [18, 145], [17, 382], [16, 230], \
                            [15, 706], [14, 497], [13, 688], [12, 131], [11, 619], \
                            [10, 464], [9, 893], [8, 225], [7, 634], [6, 631], \
                            [5, 196], [4, 935], [3, 577], [2, 244], [1, 179], [0, 645]],
                    'datatype': 'IO'
                }
            }  
        ]
        """
        clusterlist = storage.get_cluster_alive()
        if clusterlist['success']:
            # temp
            if len(clusterlist['data']) == 1:
                clusterlist['data'].append({'id':'storagesbb2', 'status':'offline'})
            # temp end
            nodes = []
            for server in clusterlist['data']:
                if server['status'] == 'online':
                    serverstatus = storage.get_server_status(server['id'])
                    if serverstatus['success']:
                        ss = serverstatus['data']
                        # SBB data
                        up, up_rate, down, down_rate = get_net_data(ss)
                        # tempral data
                        max_rate = get_max_rate()
                        rx_per = get_rx_per()
                        tx_per = get_tx_per()
                        sbb = {
                            'cpuUsed': round(ss['cpu'], 1),
                            'memUsed': round(ss['memUsed']/float(ss['memTotal'])*100, 1),
                            'tx': up, # if up != 0 else tx_per,
                            'rx': down, # if down != 0 else rx_per,
                            'datatype': 'SBB'
                        }
                        # IO data
                        io = self.__get_io_data(ss['zfsIOStat']['readBandwidth'], \
                                ss['zfsIOStat']['WriteBandwidth'])
                        nodes.append({
                            'sbb': sbb,
                            'io': io
                        })
                    else:
                        LOG.info("Get %s status error: %s" % \
                                (server['id'], serverstatus['error']))
                        nodes.append(get_phy_node())
                else:
                    nodes.append(get_phy_node())
            # serializer = PhyNodesSerializer(nodes, many=True)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            LOG.info("Get cluster alive error: %s" % clusterlist['error'])
            # return Response(clusterlist['error'], status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            nodes = [get_phy_node() for i in xrange(2)]
        # check and warn
        self._check_and_warn(nodes)
        serializer = PhyNodesSerializer(nodes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def __get_io_data(self, rb, wb):
        """
        Get real IO data
        """
        # initial
        ts = range(25)
        rbs = [[i, 0] for i in ts[::-1]]
        rbs[-1][1] = rb
        wbs = [[i, 0] for i in ts[::-1]]
        wbs[-1][1] = wb
        # generate data
        last24 = PhyNodesIO.last24()
        total = len(last24)
        for i, data in zip(range(-1-total, -1), last24):
            rbs[i][1] = data.read
            wbs[i][1] = data.write
        # update database
        if total == 0 or time.time()-\
                time.mktime(last24[total-1].create_date.timetuple()) >= 3600:
            if total < 24:
                PhyNodesIO(read=rb, write=wb).save()
            else:
                oldest = last24[0]
                oldest.read = rb
                oldest.write = wb
                oldest.save()

        return {
            'updatapackage': rbs,
            'downdatapackage': wbs,
            'datatype': 'IO'
        }

    def __check_and_warn(self, data, th_max, th_min, meter, name, count, ip):
        """
        Check threashold and send warning message if necessary.

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
    
    def _check_and_warn(self, data):
        """
        Check storage nodes' threashold and send warning message
        if necessary.
        """
        thres = settings.STORAGE_THRES_SSB
        name = '存储服务器%d报警'
        for node_data, node_thres, num in zip(data, thres, [1, 2]):
            # CPU
            self.__check_and_warn(node_data['sbb']['cpuUsed'], \
                    node_thres['cpu_util_max'], \
                    node_thres['cpu_util_min'], \
                    'cpu_util', name % num, 1, node_thres['ip'])
            # Memory
            self.__check_and_warn(node_data['sbb']['memUsed'], \
                    node_thres['mem_util_max'], \
                    node_thres['mem_util_min'], \
                    'mem_util', name % num, 1, node_thres['ip'])
            # Read 
            self.__check_and_warn(node_data['sbb']['rx'], \
                    node_thres['read_max'], \
                    node_thres['read_min'], \
                    'read', name % num, 1, node_thres['ip'])
            # Write
            self.__check_and_warn(node_data['sbb']['tx'], \
                    node_thres['write_max'], \
                    node_thres['write_min'], \
                    'write', name % num, 1, node_thres['ip'])

