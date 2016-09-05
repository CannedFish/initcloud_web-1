from django.contrib import admin
from django.contrib import admin

from biz.warning.models import Warning 


#class WarningAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Warning)
