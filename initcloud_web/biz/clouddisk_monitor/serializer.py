#coding=utf-8

from rest_framework import serializers

from biz.clouddisk_monitor.models import Clouddisk_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Clouddisk_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Clouddisk_Monitor 


class DetailedClouddisk_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Clouddisk_Monitor 

