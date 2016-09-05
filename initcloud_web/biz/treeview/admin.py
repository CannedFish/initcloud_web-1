from django.contrib import admin
from django.contrib import admin

from biz.treeview.models import Treeview 


#class TreeviewAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Treeview)
