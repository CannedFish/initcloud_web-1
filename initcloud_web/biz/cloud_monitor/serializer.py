#coding=utf-8

from rest_framework import serializers

from biz.cloud_monitor.models import Cloud_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Cloud_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cloud_Monitor 


class DetailedCloud_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cloud_Monitor 

