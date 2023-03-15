from django.shortcuts import render, get_object_or_404
# trazendo o formulario pro HTML
from .forms import FormService
from django.http import HttpResponse
from .models import Service

# Tela de novo serviço


def new_service(request):

    if request.method == "GET":
        form = FormService()
        # Colocando o form torna disponivel pelar ele no .html
        return render(request, 'novo_servico.html', {'form': form})
    elif request.method == "POST":
        form = FormService(request.POST)

        if form.is_valid():
            form.save()
            return  HttpResponse("Salvo com sucesso")
        else:
            return render(request, 'novo_servico.html', {'form': form})

def list_service(request):
    if request.method == "GET":
        services = Service.objects.all()
        return render(request, 'listar_servico.html', {'services': services})
    
def service(request, identificador):
    service = get_object_or_404(Service, identificador=identificador)
    
    return render(request, 'servico.html', {'servico': service})