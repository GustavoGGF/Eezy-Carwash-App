from django.urls import path, include
from . import views

# Declarando as paginas do site
urlpatterns = [
    path('novo_servico/', views.new_service, name='novo_servico'),
    path('listar_servico/', views.list_service, name='listar_servico'),
    path('servico/<str:identificador>', views.service, name='servico'),
    path('gerar_os/<str:identificador>', views.gerar_os, name='gerar_os'),
]
