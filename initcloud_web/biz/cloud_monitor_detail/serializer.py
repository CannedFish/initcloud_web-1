#coding=utf-8

from rest_framework import serializers

from biz.cloud_monitor_detail.models import Cloud_Monitor_Detail 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Cloud_Monitor_DetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cloud_Monitor_Detail 


class DetailedCloud_Monitor_DetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cloud_Monitor_Detail 

