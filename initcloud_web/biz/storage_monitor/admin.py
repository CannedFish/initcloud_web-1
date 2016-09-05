from django.contrib import admin
from django.contrib import admin

from biz.storage_monitor.models import Storage_Monitor 


#class Storage_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Storage_Monitor)
