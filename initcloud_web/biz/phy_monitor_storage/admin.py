from django.contrib import admin
from django.contrib import admin

from biz.phy_monitor_storage.models import Phy_Monitor_Storage 


#class Phy_Monitor_StorageAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Monitor_Storage)
