from django.contrib import admin
from django.contrib import admin

from biz.cloud_monitor_detail.models import Cloud_Monitor_Detail 


#class Cloud_Monitor_DetailAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Cloud_Monitor_Detail)
