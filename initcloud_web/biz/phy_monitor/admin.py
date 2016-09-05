from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor.models import Phy_Monitor 


#class Phy_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor)
