from django.contrib import admin
from django.contrib import admin

from biz.datapicker.models import Datapicker 


#class DatapickerAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Datapicker)
