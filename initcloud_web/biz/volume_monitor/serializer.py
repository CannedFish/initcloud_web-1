#coding=utf-8

from rest_framework import serializers

from biz.volume_monitor.models import Volume_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Volume_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Volume_Monitor 


class DetailedVolume_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Volume_Monitor 

