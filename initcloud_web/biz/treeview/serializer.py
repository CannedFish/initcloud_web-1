#coding=utf-8

from rest_framework import serializers

from biz.treeview.models import Treeview 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class TreeviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Treeview 


class DetailedTreeviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Treeview 

