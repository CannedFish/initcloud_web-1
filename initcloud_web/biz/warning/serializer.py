#coding=utf-8

from rest_framework import serializers

from biz.warning.models import Warning 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class WarningSerializer(serializers.ModelSerializer):

    class Meta:
        model = Warning 


class DetailedWarningSerializer(serializers.ModelSerializer):

    class Meta:
        model = Warning 

