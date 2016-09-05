#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor_jbod.models import Phy_Monitor_Jbod 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_Monitor_JbodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Jbod 


class DetailedPhy_Monitor_JbodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Jbod 

