# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('phy_monitor', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PhyMonitorPDU',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('volt', models.FloatField(verbose_name='Volt')),
                ('current', models.FloatField(verbose_name='Current')),
                ('watt', models.FloatField(verbose_name='Watt')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Create Date')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
