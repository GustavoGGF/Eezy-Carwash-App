from django.shortcuts import render
# trazendo o formulario pro HTML
from .forms import FormService
from django.http import HttpResponse

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
