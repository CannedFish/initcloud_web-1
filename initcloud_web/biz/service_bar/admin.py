from django.contrib import admin
from django.contrib import admin

from biz.service_bar.models import Service_Bar 


#class Service_BarAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Service_Bar)
