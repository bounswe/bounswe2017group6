# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-28 19:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_auto_20171117_1839'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='logo',
            field=models.URLField(blank=True, null=True),
        ),
    ]