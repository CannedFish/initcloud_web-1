from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor_network.models import Phy_Monitor_Network 


#class Phy_Monitor_NetworkAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor_Network)
