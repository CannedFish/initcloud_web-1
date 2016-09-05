from django.contrib import admin
from django.contrib import admin

from biz.tab.models import Tab 


#class TabAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Tab)
