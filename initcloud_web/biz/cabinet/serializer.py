#coding=utf-8

from rest_framework import serializers

from biz.cabinet.models import Cabinet 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class CabinetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cabinet 


class DetailedCabinetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cabinet 

