from django.contrib import admin
from django.contrib import admin

from biz.virtualmechine_bar.models import Virtualmechine_Bar 


#class Virtualmechine_BarAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Virtualmechine_Bar)
