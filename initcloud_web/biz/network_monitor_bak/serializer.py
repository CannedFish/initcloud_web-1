#coding=utf-8

from rest_framework import serializers

from biz.network_monitor.models import Network_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Network_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Monitor 


class DetailedNetwork_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Monitor 

