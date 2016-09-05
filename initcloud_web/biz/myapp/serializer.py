#coding=utf-8

from rest_framework import serializers

from biz.myapp.models import Myapp 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class MyappSerializer(serializers.ModelSerializer):

    class Meta:
        model = Myapp 


class DetailedMyappSerializer(serializers.ModelSerializer):

    class Meta:
        model = Myapp 

