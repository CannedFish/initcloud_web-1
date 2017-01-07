from django.db import models
from django.utils.translation import ugettext_lazy as _



class Storage_Monitor(models.Model):
    #user = models.ForeignKey(User)
    #udc = models.ForeignKey('idc.UserDataCenter')

    storage_monitorname = models.CharField(_("Role"), max_length=15, null=False)
    datacenter = models.IntegerField(_("Result"), default=0, null=False)
    deleted = models.BooleanField(_("Deleted"), default=False)
    create_date = models.DateTimeField(_("Create Date"), auto_now_add=True)

    """
    @classmethod
    def log(cls, obj, obj_name, action, result=1, udc=None, user=None):

        try:
            Storage_Monitor.objects.create(
                resource=obj.__class__.__name__,
                resource_id=obj.id,
                resource_name=obj_name,
                action=action,
                result=result
            )
        except Exception as e:
            pass
    """

class PhyNodesIO(models.Model):
    """
    Model class for storage nodes' IO data, 3 fields
    """
    read = models.FloatField(_("Read"), null=False)
    write = models.FloatField(_("Write"), null=False)
    create_date = models.DateTimeField(_("Create Date"), auto_now=True)

    @classmethod
    def last24(cls):
        """
        Return 24 IO data ordered by modified time
        """
        return PhyNodesIO.objects.order_by('create_date')

    def __str__(self):
        return "%s: <%f, %f>" % (self.create_date, \
                self.read, self.write)

