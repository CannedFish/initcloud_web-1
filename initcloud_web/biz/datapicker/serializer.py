#coding=utf-8

from rest_framework import serializers

from biz.datapicker.models import Datapicker 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class DatapickerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Datapicker 


class DetailedDatapickerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Datapicker 

