#coding=utf-8

from rest_framework import serializers

from biz.network_bar.models import Network_Bar 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Network_BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar 


class DetailedNetwork_BarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar 

