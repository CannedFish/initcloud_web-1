#coding=utf-8

from rest_framework import serializers

from biz.network_bar_router.models import Network_Bar_Router 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Network_Bar_RouterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Router 


class DetailedNetwork_Bar_RouterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Router 

