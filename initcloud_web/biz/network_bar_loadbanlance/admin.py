from django.contrib import admin
from django.contrib import admin

from biz.network_bar_loadbanlance.models import Network_Bar_Loadbanlance 


#class Network_Bar_LoadbanlanceAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Network_Bar_Loadbanlance)
