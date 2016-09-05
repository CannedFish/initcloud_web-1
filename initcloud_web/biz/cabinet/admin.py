from django.contrib import admin
from django.contrib import admin

from biz.cabinet.models import Cabinet 


#class CabinetAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Cabinet)
