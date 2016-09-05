from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor_jbod.models import Phy_Monitor_Jbod 


#class Phy_Monitor_JbodAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor_Jbod)
