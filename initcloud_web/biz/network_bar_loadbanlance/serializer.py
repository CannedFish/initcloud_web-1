#coding=utf-8

from rest_framework import serializers

from biz.network_bar_loadbanlance.models import Network_Bar_Loadbanlance 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Network_Bar_LoadbanlanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Loadbanlance 


class DetailedNetwork_Bar_LoadbanlanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Loadbanlance 

