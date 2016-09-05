from django.contrib import admin
from django.contrib import admin

from biz.myapp.models import Myapp 


#class MyappAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Myapp)
