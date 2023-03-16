from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Cliente, Carro
import re
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse

# Aqui onde a magica acontece


def clientes(request):

    # Se estiver sendo feito uma requisição do site, ira aparecer a tela para o cliente
    if request.method == 'GET':
        clientes_list = Cliente.objects.all
        return render(request, 'clientes.html', {'clientes': clientes_list})

    # Mas se estiver feito uma declaração de dados novos, sera enviado para o banco os dados abaixos
    elif request.method == 'POST':
        nome = request.POST.get('nome')
        sobrenome = request.POST.get('sobrenome')
        email = request.POST.get('email')
        cpf = request.POST.get('cpf')
        carros = request.POST.getlist('carro')
        placas = request.POST.getlist('placa')
        anos = request.POST.getlist('ano')

        # Validando se o cliente existe pelo CPF
        cliente = Cliente.objects.filter(cpf=cpf)
        if cliente.exists():
            return render(request, 'clientes.html', {'nome': nome, 'sobrenome': sobrenome, 'email': email, 'carros': zip(carros, placas, anos)})

        # Validando email inserido
        if not re.fullmatch(re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'), email):
            return render(request, 'clientes.html', {'nome': nome, 'sobrenome': sobrenome, 'cpf': cpf, 'carros': zip(carros, placas, anos)})

        # Agrupando os dados do cliente
        cliente = Cliente(
            nome=nome,
            sobrenome=sobrenome,
            email=email,
            cpf=cpf
        )

        # Salvando a tabela cliente
        cliente.save()

        # O zip serve para mesclar dados separados em grupos, assim identificando cada carro com seu respectivo cliente
        for carro, placa, ano in zip(carros, placas, anos):
            car = Carro(carro=carro, placa=placa, ano=ano, cliente=cliente)

            # Salvando a tabela do carro
            car.save()

        return render(request, 'clientes.html')

# Tela de atualização de cliente


def att_client(request):
    # selecionando o cliente que veio do select
    id_client = request.POST.get('id_cliente')
    cliente = Cliente.objects.filter(id=id_client)
    carros = Carro.objects.filter(cliente=cliente[0])

    # Juntando todos os dados do cliente
    client_id = json.loads(serializers.serialize('json', cliente))[0]['pk']
    cliente_json = json.loads(serializers.serialize('json', cliente))[
        0]['fields']
    carros_json = json.loads(serializers.serialize('json', carros))
    carros_json = [{'fields': carro['fields'], 'id':carro['pk']}
                   for carro in carros_json]
    data = {'cliente': cliente_json,
            'carro': carros_json, 'client_id': client_id}
    # Retornando para o front os dados
    print(client_id)
    return JsonResponse(data)


# Tela de atualização do carro do cliente


@csrf_exempt
def update_car(request, id):
    nome_carro = request.POST.get('carro')
    placa = request.POST.get('placa')
    ano = request.POST.get('ano')

    carro = Carro.objects.get(id=id)
    # Verificando se a placa existe em outro carro
    list_carro = Carro.objects.exclude(id=id).filter(placa=placa)
    if list_carro.exists():
        return HttpResponse('Placa já existe')
    # Atualizando dados do carro e jogando pro bd
    carro.carro = nome_carro
    carro.placa = placa
    carro.ano = ano
    carro.save()
    return redirect(reverse('clientes')+f'?aba=att_client&id_cliete={id}')

# Tela de exclusão de carro


def exclude_car(request, id):
    try:
        carro = Carro.objects.get(id=id)
        carro.delete()
        return redirect(reverse('clientes')+f'?aba=att_client&id_cliete={id}')
    except:
        # TODO message error
        return redirect(reverse('clientes'))

# Tela de atualização de cliente


def update_client(request, id):
    # Pegando os dados que veio da function update_client do front
    body = json.loads(request.body)

    # pegando os dados do json
    # get_object_or_404 vai verificar se o id do que veio da def é o mesmo que veio do json,
    # caso for o código roda normal, se não da erro 404
    cliente = get_object_or_404(Cliente, id=id)
    nome = body['nome']
    sobrenome = body['sobrenome']
    email = body['email']
    cpf = body['cpf']
    # Mandando os dados para o front via djson, mandando status junto para o código saber como rodar
    try:
        cliente.nome = nome
        cliente.sobrenome = sobrenome
        cliente.email = email  # TODO verificar se os dados estão corretos
        cliente.cpf = cpf
        cliente.save()
        return JsonResponse({'status': '200', 'nome': nome, 'sobrenome': sobrenome, 'email': email, 'cpf': cpf})
    except:
        return JsonResponse({'status': '500'})
