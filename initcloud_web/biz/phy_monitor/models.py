from django.db import models
from django.utils.translation import ugettext_lazy as _

class Phy_Monitor(models.Model):
    #user = models.ForeignKey(User)
    #udc = models.ForeignKey('idc.UserDataCenter')

    phy_monitorname = models.CharField(_("Role"), max_length=15, null=False)
    datacenter = models.IntegerField(_("Result"), default=0, null=False)
    deleted = models.BooleanField(_("Deleted"), default=False)
    create_date = models.DateTimeField(_("Create Date"), auto_now_add=True)

    """
    @classmethod
    def log(cls, obj, obj_name, action, result=1, udc=None, user=None):

        try:
            Phy_Monitor.objects.create(
                resource=obj.__class__.__name__,
                resource_id=obj.id,
                resource_name=obj_name,
                action=action,
                result=result
            )
        except Exception as e:
            pass
    """

class PhyMonitorPDU(models.Model):
    """
    Model class for PDU data, 5 fields
    """
    name = models.CharField(_("PDU"), max_length=16, default=False, null=False)
    volt = models.FloatField(_("Volt"), null=False)
    current = models.FloatField(_("Current"), null=False)
    watt = models.FloatField(_("Watt"), null=False)
    create_date = models.DateTimeField(_("Create Date"), auto_now=True)

    @classmethod
    def last4(cls, pdu):
        """
        Return 4 pdus' data ordered by modified time

        @params
        pdu: the name of target pdu
        """
        return PhyMonitorPDU.objects.filter(name=pdu)\
                .order_by('create_date')

    def __str__(self):
        return "%s: <%f, %f, %f>" % (self.name, \
                self.volt, self.current, self.watt)

