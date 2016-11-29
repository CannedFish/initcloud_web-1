from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor_sas.models import Phy_Monitor_Sas 


#class Phy_Monitor_SasAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor_Sas)
