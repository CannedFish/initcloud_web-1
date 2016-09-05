from django.contrib import admin
from django.contrib import admin

from biz.wuli_storage.models import Wuli_Storage 


#class Wuli_StorageAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Wuli_Storage)
