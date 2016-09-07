from django.contrib import admin
from django.contrib import admin

from biz.network_bar_sdn.models import Network_Bar_Sdn 


#class Network_Bar_SdnAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Network_Bar_Sdn)
