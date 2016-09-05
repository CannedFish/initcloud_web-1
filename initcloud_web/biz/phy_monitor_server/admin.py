from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor_server.models import Phy_Monitor_Server 


#class Phy_Monitor_ServerAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor_Server)
