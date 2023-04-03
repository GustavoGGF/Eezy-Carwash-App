from django.urls import path
from . import views

# Declarando as paginas do site
urlpatterns = [
    path('', views.clientes, name='clientes'),
    path('atualiza_cliente/', views.att_client, name='atualiza_cliente'),
    path('update_carro/<int:id>', views.update_car, name='update_carro'),
    path('excluir_carro/<int:id>', views.exclude_car, name='excluir_carro'),
    path('update_cliente/<int:id>', views.update_client, name='update_client'),
    path('new_car/', views.new_car, name='novo_carro'),
]
