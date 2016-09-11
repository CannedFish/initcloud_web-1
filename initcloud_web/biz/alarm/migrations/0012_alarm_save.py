# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alarm', '0011_alarm_alarm_notification'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alarm_Save',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('alarm_name', models.CharField(max_length=128, null=True, verbose_name='Name')),
                ('deleted', models.BooleanField(default=False, verbose_name='Deleted')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Create Date')),
                ('alarm_object', models.CharField(default=None, max_length=128)),
                ('alarm_meter', models.CharField(default=None, max_length=128)),
                ('alarm_count', models.CharField(default=None, max_length=128)),
                ('alarm_data', models.CharField(default=None, max_length=128)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
