# Generated by Django 4.1.7 on 2023-03-07 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0003_rename_protocole_service_protocol'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='protocol',
            field=models.CharField(blank=True, max_length=52, null=True),
        ),
    ]
