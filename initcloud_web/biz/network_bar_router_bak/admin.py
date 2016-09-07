from django.contrib import admin
from django.contrib import admin

from biz.network_bar_router.models import Network_Bar_Router 


#class Network_Bar_RouterAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Network_Bar_Router)
