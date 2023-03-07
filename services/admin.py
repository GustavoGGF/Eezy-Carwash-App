from django.contrib import admin
from .models import MaintenanceCategory, Service

# Register your models here.
admin.site.register(MaintenanceCategory)
admin.site.register(Service)
