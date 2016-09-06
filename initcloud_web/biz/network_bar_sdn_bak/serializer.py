#coding=utf-8

from rest_framework import serializers

from biz.network_bar_sdn.models import Network_Bar_Sdn 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Network_Bar_SdnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Sdn 


class DetailedNetwork_Bar_SdnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Sdn 

