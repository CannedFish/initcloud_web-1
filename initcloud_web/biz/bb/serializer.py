#coding=utf-8

from rest_framework import serializers

from biz.bb.models import Bb 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class BbSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bb 


class DetailedBbSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bb 

