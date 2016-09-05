#coding=utf-8

from rest_framework import serializers

from biz.tab.models import Tab 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class TabSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tab 


class DetailedTabSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tab 

