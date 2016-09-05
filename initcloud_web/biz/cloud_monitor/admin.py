from django.contrib import admin
from django.contrib import admin

from biz.cloud_monitor.models import Cloud_Monitor 


#class Cloud_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Cloud_Monitor)
