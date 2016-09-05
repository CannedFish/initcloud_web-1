from django.contrib import admin
from django.contrib import admin

from biz.clouddisk_monitor.models import Clouddisk_Monitor 


#class Clouddisk_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Clouddisk_Monitor)
