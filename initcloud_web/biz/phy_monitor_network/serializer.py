#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor_network.models import Phy_Monitor_Network 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_Monitor_NetworkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Network 


class DetailedPhy_Monitor_NetworkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Network 

