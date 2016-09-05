from django.contrib import admin
from django.contrib import admin

from biz.volume_monitor.models import Volume_Monitor 


#class Volume_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Volume_Monitor)
