#coding=utf-8

from rest_framework import serializers

from biz.tech_support.models import Tech_Support 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Tech_SupportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tech_Support 


class DetailedTech_SupportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tech_Support 

