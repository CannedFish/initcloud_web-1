#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor_pdu.models import Phy_Monitor_Pdu 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_Monitor_PduSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Pdu 


class DetailedPhy_Monitor_PduSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Pdu 

