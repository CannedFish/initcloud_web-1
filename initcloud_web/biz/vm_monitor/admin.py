from django.contrib import admin
from django.contrib import admin

from biz.vm_monitor.models import Vm_Monitor 


#class Vm_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Vm_Monitor)
