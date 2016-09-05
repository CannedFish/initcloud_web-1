#coding=utf-8

from rest_framework import serializers

from biz.storage__bar.models import Storage__Bar 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Storage__BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Storage__Bar 


class DetailedStorage__BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Storage__Bar 

