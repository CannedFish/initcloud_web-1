#coding=utf-8

from rest_framework import serializers

from biz.virtualmechine_bar.models import Virtualmechine_Bar 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Virtualmechine_BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Virtualmechine_Bar 


class DetailedVirtualmechine_BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Virtualmechine_Bar 

