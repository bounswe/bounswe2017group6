# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-28 08:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_auto_20171228_1113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='contacts',
            field=models.CharField(blank=True, default='', max_length=150),
        ),
    ]