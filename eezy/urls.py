from django.contrib import admin
from django.urls import path, include

# Declarando as paginas do site
urlpatterns = [
    path('admin/', admin.site.urls),
    path('clientes/', include('client.urls')),
    path('', include('client.urls')),
    path('servicos/', include('services.urls')),
]
