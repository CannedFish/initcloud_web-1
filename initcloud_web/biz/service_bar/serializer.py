#coding=utf-8

from rest_framework import serializers

from biz.service_bar.models import Service_Bar 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Service_BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service_Bar 


class DetailedService_BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service_Bar 

