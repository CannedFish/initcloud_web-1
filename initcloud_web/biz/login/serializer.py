#coding=utf-8

from rest_framework import serializers

from biz.login.models import Login 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class LoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = Login 


class DetailedLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = Login 

