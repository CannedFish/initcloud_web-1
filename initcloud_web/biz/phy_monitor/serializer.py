#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor.models import Phy_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor 


class DetailedPhy_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor 

