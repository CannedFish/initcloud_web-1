from django.contrib import admin
from django.contrib import admin

from biz.login.models import Login 


#class LoginAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Login)
