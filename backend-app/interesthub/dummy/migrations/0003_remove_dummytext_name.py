# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-20 22:43
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dummy', '0002_dummytext_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dummytext',
            name='name',
        ),
    ]
