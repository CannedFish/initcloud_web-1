#coding=utf-8

from rest_framework import serializers

from biz.phy_nodes.models import Phy_Nodes 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Phy_NodesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Nodes 


class DetailedPhy_NodesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Phy_Nodes 

