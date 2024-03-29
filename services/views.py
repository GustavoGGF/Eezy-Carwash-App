from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, JsonResponse
from .models import Service, MaintenanceCategory
from fpdf import FPDF
from io import BytesIO
from client.models import Cliente, Carro
from .choices import ChoicesMaintenanceCategory
import json
from datetime import datetime

# Tela de novo serviço

def new_service(request):
    # Se for uma requisição de dados
    if request.method == "GET":
        # Pegando a lista de clientes
        clientes_list = Cliente.objects.all
        # Pegando as opções de categoria de manutenção
        categorias = ChoicesMaintenanceCategory.choices
        print(categorias)
        # Jogando os daos pro html em json, ai lá eu renderizo os dados pelo django
        return render(request, 'novo_servico.html', {'clientes': clientes_list,'categorias':categorias})
    # Caso o site esteja mandando dados para o back, ó código a baixo irá rodar
    elif request.method == "POST":
        # pegando o id do POST feito quando o cliente é escolhido
        id = json.loads(request.body)
        # Pegando o carro do cliente que tem o ID expecificado
        carros = Carro.objects.all().filter(cliente_id=id['id'])
        # pegando os dados dos carros e transformando em uma lista
        carros_list = list(carros.values())
        # Transformando os dados em arquivo JSON
        json_data = json.dumps(carros_list)
        # Retornando dados json (a lista de carros)
        return JsonResponse(json_data, safe=False)


# Tela da lista de serviço
def list_service(request):
    #* Se o metodo for de requisição, mostra o serviço na tela
    if request.method == "GET":
        services = Service.objects.all()
        print(type(services))
        return render(request, 'listar_servico.html', {'services': services})

    if request.method =='POST':
        body = json.loads(request.body)
        title = body['titulo']
        cliente = Cliente.objects.get(id=body['id'])
        servicos = list(body['servico'])
        inicio_servico = datetime.strptime(body['inicio_servico'], '%Y-%m-%d').date()
        final_servico = datetime.strptime(body['final_servico'], '%Y-%m-%d').date()

        if len(title) < 1:
            title = f'Servico para {cliente.nome} {cliente.sobrenome}'

        servico = Service(
            titulo = title,
            cliente = cliente,
            data_inicio = inicio_servico,
            data_entrega = final_servico,
        )

        servico.save()

        for serv in servicos:
            categoria = MaintenanceCategory.objects.get(titulo=serv)
            servico.maintenance_category.add(categoria)

        return JsonResponse({'status': 'ok'})


    if request.method == 'DELETE':

        body = json.loads(request.body)

        identificador = body['identificador']

        servico = Service.objects.get(identificador=identificador)

        servico.delete()

        return JsonResponse({'status': 'ok'})

# Tela dos serviços
def service(request, identificador):
    service = get_object_or_404(Service, identificador=identificador)

    return render(request, 'servico.html', {'servico': service})

# Tela de salvar serviço
def salvar_os(request, identificador):
    service = get_object_or_404(Service, identificador=identificador)
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            Description = body['descricao']
            service.descricao += " " + Description
            service.save()
            serialized_service = {
                'id': service.id,
                'titulo': service.titulo,
                'cliente': service.cliente.id if service.cliente else None,
                'data_inicio': service.data_inicio.isoformat() if service.data_inicio else None,
                'data_entrega': service.data_entrega.isoformat() if service.data_entrega else None,
                'finalizado': service.finalizado,
                'protocol': service.protocol,
                'identificador': service.identificador,
                'descricao': service.descricao,
            }
            return JsonResponse({'status': 'ok', 'servico': serialized_service})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Método não permitido'}, status=405)
    return JsonResponse({'status': '200'}, status=200)

# Tela de geração do pdf da ordem de serviço
def gerar_os(request, identificador):
    print(request.method)
    servico = get_object_or_404(Service, identificador=identificador)

    pdf = FPDF()
    pdf.add_page()

    pdf.set_font('Arial', 'B', 12)

    pdf.set_fill_color(240, 240, 240)
    pdf.cell(35, 10, 'Cliente', 1, 0,'L',1)
    pdf.cell(0, 10, f'{servico.cliente.nome}', 1, 1,'L',1)

    pdf.cell(35,10, 'Manutenções', 1, 0, 'L',1)

    categorias_manutencao =  servico.maintenance_category.all()
    for i, manutencao in enumerate(categorias_manutencao):
        pdf.cell(0, 10, f'- {manutencao.get_titulo_display()}', 1, 1, 'L', 1)
        if not i == len(categorias_manutencao) -1:
            pdf.cell(35, 10, '', 0, 0)

    pdf.cell(35,10,'Data de início',1,0,'L',1)
    pdf.cell(0,10,f'{servico.data_inicio}',1,1,'L',1)
    pdf.cell(35,10,f'Data de entrega',1,0,'L',1)
    pdf.cell(0,10,f'{servico.data_entrega}',1,1,'L',1)
    pdf.cell(35,10,f'Protocolo',1,0,'L',1)
    pdf.cell(0,10,f'{servico.protocol}',1,1,'L',1)
    pdf.cell(50,10,f'Descrição dos serviços',1,0,'L',1)
    pdf.cell(0,10,f'{servico.descricao}',1,1, 'L',1)
    pdf_content = pdf.output(dest='S').encode('latin1')
    pdf_bytes = BytesIO(pdf_content)

    return FileResponse(pdf_bytes, as_attachment=True, filename="os.pdf")
