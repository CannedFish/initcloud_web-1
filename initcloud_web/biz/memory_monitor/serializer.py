#coding=utf-8

from rest_framework import serializers

from biz.memory_monitor.models import Memory_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Memory_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Memory_Monitor 


class DetailedMemory_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Memory_Monitor 

