#coding=utf-8

from rest_framework import serializers

from biz.phy_monitor_storage.models import Phy_Monitor_Storage 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_Monitor_StorageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Storage 


class DetailedPhy_Monitor_StorageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Monitor_Storage 

