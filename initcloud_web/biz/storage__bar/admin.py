from django.contrib import admin
from django.contrib import admin

from biz.storage__bar.models import Storage__Bar 


#class Storage__BarAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Storage__Bar)
