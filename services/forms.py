from django.forms import ModelForm
from .models import Service, MaintenanceCategory

# Criando formulario para ajustar o serviço criado


class FormService(ModelForm):
    class Meta:
        # Definindo modelo do protocolo, sera o que tem no Service
        model = Service
        # Definindo o que será escluido no protocolo
        exclude = ['finalizado', 'protocol']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['titulo'].widget.attrs.update({'class': 'teste'})
