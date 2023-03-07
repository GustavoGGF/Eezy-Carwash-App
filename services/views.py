from django.shortcuts import render
# trazendo o formulario pro HTML
from .forms import FormService

# Tela de novo serviço


def new_service(request):
    form = FormService
    # Colocando o form torna disponivel pelar ele no .html
    return render(request, 'novo_servico.html', {'form': form})
