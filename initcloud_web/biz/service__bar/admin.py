from django.contrib import admin
from django.contrib import admin

from biz.service__bar.models import Service__Bar 


#class Service__BarAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Service__Bar)
