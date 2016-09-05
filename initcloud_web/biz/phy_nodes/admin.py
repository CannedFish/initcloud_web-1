from django.contrib import admin
from django.contrib import admin

from biz.phy_nodes.models import Phy_Nodes 


#class Phy_NodesAdmin(admin.ModelAdmin):
#    list_display = ("user", "mobile", "user_type", "balance")

admin.site.register(Phy_Nodes)
