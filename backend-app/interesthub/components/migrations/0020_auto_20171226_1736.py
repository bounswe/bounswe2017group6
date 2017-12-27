# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-26 14:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0016_checkboxdefinition_checkboxitem_dropdowndefinition_dropdownitem'),
        ('components', '0019_auto_20171226_1624'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='checkboxitem',
            name='checkbox',
        ),
        migrations.RemoveField(
            model_name='dropdownitem',
            name='dropdown',
        ),
        migrations.AddField(
            model_name='checkboxcomponent',
            name='selecteds',
            field=models.ManyToManyField(related_name='selected_checkboxes', to='content.CheckboxItem'),
        ),
        migrations.AddField(
            model_name='dropdowncomponent',
            name='selected',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='selected_dropdowns', to='content.DropdownItem'),
        ),
        migrations.AlterField(
            model_name='component',
            name='checkbox',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='component', to='components.CheckboxComponent'),
        ),
        migrations.DeleteModel(
            name='CheckBoxItem',
        ),
        migrations.DeleteModel(
            name='DropdownItem',
        ),
    ]