from django.urls import path, include
from . import views
from django.contrib import admin

# Declarando as paginas do site
urlpatterns = [
    path('admin/', admin.site.urls),
    path('novo_servico/', views.new_service, name='novo_servico'),
]
