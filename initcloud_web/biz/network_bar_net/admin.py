from django.contrib import admin
from django.contrib import admin

from biz.network_bar_net.models import Network_Bar_Net 


#class Network_Bar_NetAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Network_Bar_Net)
