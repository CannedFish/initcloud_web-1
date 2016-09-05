#coding=utf-8

from rest_framework import serializers

from biz.network_bar_net.models import Network_Bar_Net 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Network_Bar_NetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Net 


class DetailedNetwork_Bar_NetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Network_Bar_Net 

