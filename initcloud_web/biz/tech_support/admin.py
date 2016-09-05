from django.contrib import admin
from django.contrib import admin

from biz.tech_support.models import Tech_Support 


#class Tech_SupportAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Tech_Support)
