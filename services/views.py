from django.shortcuts import render, get_object_or_404
# trazendo o formulario pro HTML
from .forms import FormService
from django.http import HttpResponse, FileResponse
from .models import Service
from fpdf import FPDF
from io import BytesIO

# Tela de novo serviço


def new_service(request):

    if request.method == "GET":
        form = FormService()
        # Colocando o form torna disponivel pelar ele no .html
        return render(request, 'novo_servico.html', {'form': form})
    elif request.method == "POST":
        form = FormService(request.POST)
        
        # Validando formularioo
        if form.is_valid():
            form.save()
            services = Service.objects.all()
            # TODO fazer uma tela de retorno direito
            return render(request, 'listar_servico.html', {'services': services})
        else:
            return render(request, 'novo_servico.html', {'form': form})

# Tela da lista de serviço
def list_service(request):
    if request.method == "GET":
        services = Service.objects.all()
        return render(request, 'listar_servico.html', {'services': services})
    
# Tela dos serviços
def service(request, identificador):
    service = get_object_or_404(Service, identificador=identificador)
    
    return render(request, 'servico.html', {'servico': service})

# Tela da geração de ordem de serviço
def gerar_os(request, identificador):
    servico = get_object_or_404(Service, identificador=identificador)
    
    # TODO estilizar melhor esse pdf
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
    
    pdf_content = pdf.output(dest='S').encode('latin1')
    pdf_bytes = BytesIO(pdf_content)

    return FileResponse(pdf_bytes, as_attachment=True, filename="os.pdf")
