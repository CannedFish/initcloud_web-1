#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor_sas.models import Phy_Monitor_Sas 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_Monitor_SasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Sas 


class DetailedPhy_Monitor_SasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Sas 

