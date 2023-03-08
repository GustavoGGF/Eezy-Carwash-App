from django.forms import ModelForm
from .models import Service, MaintenanceCategory

# Criando formulario para ajustar o serviço criado


class FormService(ModelForm):
    class Meta:
        # Definindo modelo do protocolo, sera o que tem no Service
        model = Service
        # Definindo o que será escluido no protocolo
        exclude = ['finalizado', 'protocol']

    # Adicioando classe aos fields
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update(
                {'class': 'form-control'})
            self.fields[field].widget.attrs.update(
                {'placeholder': field})

        # Adicionando o nome correto do titulo aos fields
        choices = list()
        for i, j in self.fields['maintenance_category'].choices:
            category = MaintenanceCategory.objects.get(titulo=j)
            choices.append((i.value, category.get_titulo_display()))

        self.fields['maintenance_category'].choices = choices
