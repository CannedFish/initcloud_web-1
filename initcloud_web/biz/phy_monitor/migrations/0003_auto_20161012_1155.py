# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('phy_monitor', '0002_phymonitorpdu'),
    ]

    operations = [
        migrations.AddField(
            model_name='phymonitorpdu',
            name='name',
            field=models.CharField(default=False, max_length=16, verbose_name='PDU'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='phymonitorpdu',
            name='create_date',
            field=models.DateTimeField(auto_now=True, verbose_name='Create Date'),
            preserve_default=True,
        ),
    ]
