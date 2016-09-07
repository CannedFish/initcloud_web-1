from django.contrib import admin
from django.contrib import admin

from biz.network_monitor.models import Network_Monitor 


#class Network_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Network_Monitor)
