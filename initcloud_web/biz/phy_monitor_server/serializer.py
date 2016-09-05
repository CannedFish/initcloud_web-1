#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor_server.models import Phy_Monitor_Server 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_Monitor_ServerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Server 


class DetailedPhy_Monitor_ServerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Server 

