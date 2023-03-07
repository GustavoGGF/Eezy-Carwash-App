
from django.db.models import TextChoices


class ChoicesMaintenanceCategory(TextChoices):
    TROCAR_VALVULA_MOTOR = "TVM", "Trocar válcula do motor"
    TROCAR_OLEO = "TO", "Troca de óleo"
    BALANCEAMENTO = "B", "Balanceamento"
    TROCA_DE_PNEU = "TDP", "Troca de pneu"
