from django.contrib import admin
from django.contrib import admin

from biz.memory_monitor.models import Memory_Monitor 


#class Memory_MonitorAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Memory_Monitor)
