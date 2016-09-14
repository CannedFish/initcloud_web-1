import logging, random

from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status

from biz.common.pagination import PagePagination
from biz.storage_monitor.serializer import StorageNodeSerializer, TreeNodeSerializer,\
        StorageBarSerializer, PhyNodesSerializer

import cloud.api.storage as storage

LOG = logging.getLogger(__name__)


def byte_2_gbyte(val):
    return round(val/1024.0/1024.0/1024.0)

def byte_2_kbit(val):
    return round(val/1024.0*8)

def get_cpu_used():
    return round(random.uniform(2, 65), 1)

def get_cpu_frequence():
    return round(random.uniform(2.6, 2.7), 1)

def get_mem_used():
    return round(random.uniform(2, 80), 1)

def get_mem_total():
    return 197

def get_rx_per():
    return round(random.uniform(0, 90), 1)

def get_tx_per():
    return round(random.uniform(0, 90), 1)

def get_max_rate():
    return 1024*1024

def get_storage_node_data(name):
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
        clusterlist = storage.get_cluster_list()
        if clusterlist['success']:
            queryset = []
            for server in clusterlist['data']:
                EmptyData = get_storage_node_data(server['hostname'])
                serverstatus = storage.get_server_status(server['id'])
                if serverstatus['success']:
                    status = serverstatus['data']
                    if status['status'] != 'offline':
                        # unit conversion
                        status['memUsed'] = byte_2_gbyte(status['memUsed'])
                        status['memTotal'] = byte_2_gbyte(status['memTotal'])
                        # for net in status['netIntfStatus']:
                        #     net['rxRate'] = byte_2_kbit(net['rxRate'])
                        #     net['txRate'] = byte_2_kbit(net['txRate'])
                        # nets_rx_rate = [net['rxRate'] for net in status['netIntfStatus']]
                        # nets_rx_per = [net['rxPer'] for net in status['netIntfStatus']]
                        # nets_tx_rate = [net['txRate'] for net in status['netIntfStatus']]
                        # nets_tx_per = [net['txPer'] for net in status['netIntfStatus']]
                        # # real data
                        # up = round(reduce(lambda x,y: x+y, nets_tx_per)/float(len(nets_tx_per)), 1)
                        # up_rate = reduce(lambda x,y: x+y, nets_tx_rate)
                        # down = round(reduce(lambda x,y: x+y, nets_rx_per)/float(len(nets_rx_per)), 1)
                        # down_rate = reduce(lambda x,y: x+y, nets_rx_rate)
                        up, up_rate, down, down_rate = get_net_data(status)
                        # tempral data
                        max_rate = get_max_rate()
                        rx_per = get_rx_per()
                        tx_per = get_tx_per()
                        # constructs data
                        query = {
                            'name': server['hostname'],
                            'item': {
                                'cpu_used': [round(status['cpu'], 1), get_cpu_used()],
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
                                    'up': up if up != 0 else tx_per,
                                    'up_rate': up_rate if up != 0 else max_rate*tx_per,
                                    'down': down if down != 0 else rx_per,
                                    'down_rate': down_rate if down != 0 else max_rate*rx_per
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
    return {
        'label': s_id,
        'nodelist': get_node_list()
    }

class TreeNodeList(generics.ListAPIView):
    serializer_class = TreeNodeSerializer
    pagination_class = PagePagination

    def get_queryset(self):
        poolstatus = storage.get_pool_status()
        if poolstatus['success']:
            serverlist = storage.get_cluster_alive()
            if serverlist['success']:
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
                        else:
                            nvme_total += 1
                            if used:
                                nvme += 1
                storage_bar = {
                    'disk': [disk_used, disk_total-disk_used],
                    'SSD': [ssd, ssd_total-ssd],
                    'NVMe': [nvme, nvme_total-nvme],
                    'SAS': [sas, sas_total-sas]
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

def get_phy_node():
    return {
        'cpuUsed': get_cpu_used(),
        'memUsed': get_mem_used(),
        'rx': get_rx_per(),
        'tx': get_tx_per()
    }

class PhyNodesList(APIView):
    def get(self, request):
        """
        nodes = [
            {
                'cpuUsed': 70,
                'memUsed': 10,
                'rx': 85,
                'tx': 100
            },
            {
                'cpuUsed': 75,
                'memUsed': 30,
                'rx': 95,
                'tx': 60
            }  
        ]
        """
        clusterlist = storage.get_cluster_alive()
        if clusterlist['success']:
            nodes = []
            for server in clusterlist['data']:
                if server['status'] == 'online':
                    serverstatus = storage.get_server_status(server['id'])
                    if serverstatus['success']:
                        ss = serverstatus['data']
                        up, up_rate, down, down_rate = get_net_data(ss)
                        # tempral data
                        max_rate = get_max_rate()
                        rx_per = get_rx_per()
                        tx_per = get_tx_per()
                        nodes.append({
                            'cpuUsed': round(ss['cpu'], 1),
                            'memUsed': round(ss['memUsed']/float(ss['memTotal'])*100, 1),
                            'tx': up if up != 0 else tx_per,
                            'rx': down if down != 0 else rx_per
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
        serializer = PhyNodesSerializer(nodes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

