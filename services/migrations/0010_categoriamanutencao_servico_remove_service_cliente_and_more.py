# Generated by Django 4.1.7 on 2023-03-07 17:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0001_initial'),
        ('services', '0009_service_identificador'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoriaManutencao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(choices=[('TVM', 'Trocar válcula do motor'), ('TO', 'Troca de óleo'), ('B', 'Balanceamento')], max_length=3)),
                ('preco', models.DecimalField(decimal_places=2, max_digits=8)),
            ],
        ),
        migrations.CreateModel(
            name='Servico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=30)),
                ('data_inicio', models.DateField(null=True)),
                ('data_entrega', models.DateField(null=True)),
                ('finalizado', models.BooleanField(default=False)),
                ('protocole', models.CharField(blank=True, max_length=52, null=True)),
                ('identificador', models.CharField(blank=True, max_length=24, null=True)),
                ('categoria_manutencao', models.ManyToManyField(to='services.categoriamanutencao')),
                ('cliente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='client.cliente')),
            ],
        ),
        migrations.RemoveField(
            model_name='service',
            name='cliente',
        ),
        migrations.RemoveField(
            model_name='service',
            name='maintenance_category',
        ),
        migrations.DeleteModel(
            name='MaintenanceCategory',
        ),
        migrations.DeleteModel(
            name='Service',
        ),
    ]