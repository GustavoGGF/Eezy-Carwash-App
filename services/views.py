from django.shortcuts import render

# Tela de novo serviço


def new_service(request):

    return render(request, 'novo_servico.html')
