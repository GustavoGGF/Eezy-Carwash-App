from django.db import models
from client.models import Cliente
from .choices import ChoicesMaintenanceCategory
from datetime import datetime
from secrets import token_hex, token_urlsafe

# Classe que cria as categorias de manutenção

class MaintenanceCategory(models.Model):
    # As categorias que aparecem aqui são importadas de ChoicesMaintenanceCategory
    titulo = models.CharField(
        max_length=3, choices=ChoicesMaintenanceCategory.choices)
    preco = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self) -> str:
        return self.titulo

# Classe que cria os serviços


class Service(models.Model):
    titulo = models.CharField(max_length=30)
    # O cliente esta ligado a chave de models importada de Cliente do app CLient
    # Variavel criada para quando deletada não apague os dados
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True)
    # Variavel que está ligada nas categorias
    maintenance_category = models.ManyToManyField(MaintenanceCategory)
    data_inicio = models.DateField(null=True)
    data_entrega = models.DateField(null=True)
    finalizado = models.BooleanField(default=False)
    protocol = models.CharField(max_length=52, null=True, blank=True)
    identificador = models.CharField(max_length=24, null=True, blank=True)
    descricao = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.titulo

# função que garante que cada serviço tera um protocolo ligado
    def save(self, *args, **kwargs):
        if not self.protocol:
            # procolo criado adicionado a data atual mais um token hex
            self.protocol = datetime.now().strftime("%d/%m/%Y-%H:%M:%S-") + token_hex(16)

        if not self.identificador:
            self.identificador = token_urlsafe(16)

        super(Service, self).save(*args, **kwargs)

# função que calcula o preco total dos serviços prestados
    def total_price(self):
        total_price = float(0)
        for category in self.maintenance_category.all():
            total_price += float(category.preco)

        return total_price
