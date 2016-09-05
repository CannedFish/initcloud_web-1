#coding=utf-8

from rest_framework import serializers

from biz.service__bar.models import Service__Bar 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Service__BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service__Bar 


class DetailedService__BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service__Bar 

