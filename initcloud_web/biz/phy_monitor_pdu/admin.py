from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor_pdu.models import Phy_Monitor_Pdu 


#class Phy_Monitor_PduAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor_Pdu)
