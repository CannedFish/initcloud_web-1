# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('storage_monitor', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PhyNodesIO',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('read', models.FloatField(verbose_name='Read')),
                ('write', models.FloatField(verbose_name='Write')),
                ('create_date', models.DateTimeField(auto_now=True, verbose_name='Create Date')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
