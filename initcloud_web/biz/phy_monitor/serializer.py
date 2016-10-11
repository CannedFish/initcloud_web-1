# -*- coding: utf-8 -*-

from rest_framework import serializers

# Cabinet
class CpuTempratureSerializer(serializers.Serializer):
    node1 = serializers.ListField(child=serializers.FloatField())
    node2 = serializers.ListField(child=serializers.FloatField())
    node3 = serializers.ListField(child=serializers.FloatField())
    node4 = serializers.ListField(child=serializers.FloatField())

class CabinetSerializer(serializers.Serializer):
    _24switchboard = serializers.ListField(child=\
            serializers.ListField(child=serializers.IntegerField()))
    _48switchboard_01 = serializers.ListField(child=\
            serializers.ListField(child=serializers.IntegerField()))
    _48switchboard_02 = serializers.ListField(child=\
            serializers.ListField(child=serializers.IntegerField()))
    _48switchboard_03 = serializers.ListField(child=\
            serializers.ListField(child=serializers.IntegerField()))
    cpu_temperature = CpuTempratureSerializer(many=True)
    jbod_status_01 = serializers.ListField(child=serializers.IntegerField())
    jbod_status_02 = serializers.ListField(child=serializers.IntegerField())
    memory_server_status_01 = serializers.ListField(child=serializers.IntegerField())
    memory_server_status_02 = serializers.ListField(child=serializers.IntegerField())

# PhyMonitorJBOD
class PhyMonitorJBODSerializer(serializers.Serializer):
    disk = serializers.ListField(child=serializers.IntegerField())
    systemUI = serializers.ListField(child=\
            serializers.ListField(child=serializers.FloatField()))
    electric_rota = serializers.ListField(child=serializers.IntegerField())
    model = serializers.CharField()

# PhyMonitorNetwork
class PhyMonitorNetworkTrafficSerializer(serializers.Serializer):
    link = serializers.IntegerField()
    upload = serializers.FloatField()
    download = serializers.FloatField()

class PhyMonitorNetworkSerializer(serializers.Serializer):
    model = serializers.CharField()
    traffic = PhyMonitorNetworkTrafficSerializer(many=True)
    traffic_40GB = PhyMonitorNetworkTrafficSerializer(many=True)

# PhyMonitorServer
class CPUSerializer(serializers.Serializer):
    V = serializers.FloatField()
    T = serializers.FloatField()

class PDUSerializer(serializers.Serializer):
    volt = serializers.FloatField()
    current = serializers.FloatField()
    watt = serializers.FloatField()

class NodeSerializer(serializers.Serializer):
    CPU = CPUSerializer(many=True)
    memory_voltage = serializers.ListField(child=serializers.FloatField())
    fan_speed = serializers.IntegerField()
    PDU = PDUSerializer()

class PhyMonitorServerSerializer(serializers.Serializer):
    model = serializers.CharField()
    nodes = NodeSerializer(many=True)

# PhyMonitorStorage
class PhyNodeSerializer(serializers.Serializer):
    id = serializers.CharField()
    cpu1 = serializers.ListField(child=serializers.FloatField())
    cpu2 = serializers.ListField(child=serializers.FloatField())
    memory_voltage = serializers.ListField(child=serializers.IntegerField())

class PhyMonitorStorageSerializer(serializers.Serializer):
    nodes = PhyNodeSerializer(many=True)
    disk = serializers.ListField(child=serializers.IntegerField())
    disk_status = serializers.DictField(child=serializers.CharField())
    electric_rota = serializers.ListField(child=\
            serializers.ListField(child=serializers.IntegerField()))
    systemUI = serializers.ListField(child=serializers.FloatField())
    PDU = serializers.ListField(child=\
            serializers.ListField(child=serializers.FloatField()))
    model = serializers.CharField()

# PhyPDU
class PDUDataSerializer(serializers.Serializer):
    voltdata = serializers.ListField(child=\
            serializers.ListField(child=serializers.FloatField()))
    currentdata = serializers.ListField(child=\
            serializers.ListField(child=serializers.FloatField()))
    wattdata = serializers.ListField(child=\
            serializers.ListField(child=serializers.FloatField()))

class PDUSerializer(serializers.Serializer):
    currentdata = serializers.ListField(child=serializers.FloatField())
    data = PDUDataSerializer()

class PhyPDUSerializer(serializers.Serializer):
    PDU1 = PDUSerializer()
    PDU2 = PDUSerializer()

