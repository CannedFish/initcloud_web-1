#coding=utf-8

from rest_framework import serializers

from biz.wuli_storage.models import Wuli_Storage 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Wuli_StorageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wuli_Storage 


class DetailedWuli_StorageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wuli_Storage 

