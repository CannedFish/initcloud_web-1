#coding=utf-8

from rest_framework import serializers

from biz.vm_monitor.models import Vm_Monitor 

from biz.idc.serializer import DetailedUserDataCenterSerializer

class Vm_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vm_Monitor 


class DetailedVm_MonitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vm_Monitor 

