#coding=utf-8

from rest_framework import serializers

from biz.storage_monitor.models import Storage_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Storage_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Storage_Monitor 


class DetailedStorage_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Storage_Monitor 

