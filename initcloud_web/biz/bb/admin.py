from django.contrib import admin
from django.contrib import admin

from biz.bb.models import Bb 


#class BbAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Bb)
