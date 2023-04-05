from django.db import models
# O modal é nosso gerenciador de banco de dados, aqui definimos as celulas e alguns requisitos

# Modal do cliente


class Cliente(models.Model):
    # Definindo a quantidade maxima de caracteres e se é caracteres ou email
    nome = models.CharField(max_length=50)
    sobrenome = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    cpf = models.CharField(max_length=12)

    def __str__(self) -> str:
        return self.nome

# Modal dos carros


class Carro(models.Model):
    # Defefindo quantidade maxima de caracteres
    carro = models.CharField(max_length=50)
    placa = models.CharField(max_length=7)
    # Definindo que é número inteiro
    ano = models.IntegerField()
    # Definindo que é uma chave estrangeira
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    # Definindo que é número inteiro
    lavagens = models.IntegerField(default=0)
    consertos = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.carro
