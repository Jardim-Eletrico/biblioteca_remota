from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from pedidos.models import Pedido
from livros.models import Exemplar
from .models import Emprestimo

@transaction.atomic
def efetivar_emprestimo(
    pedido_id,
    exemplar_id,
    data_prevista_devolucao=None,
    ):
    pedido = Pedido.objects.select_for_update().get(
        pk = pedido_id
    )

    exemplar = Exemplar.objects.select_for_update().get(
        pk = exemplar_id
    )
    
    if pedido.status != 'aprovado':
        raise ValidationError(
            'O pedido deve estar aprovado'
        )

    if hasattr(pedido, 'emprestimo'):
        raise ValidationError(
            'Este pedido já tem um empréstimo'
        )

    if exemplar.status != 'disponivel':
        raise ValidationError(
            'Este exemplar não está disponível'
        )

    if exemplar.edicao_id != pedido.edicao_id:
        raise ValidationError(
            'O exemplar não pertence à edição solicitada'
        )

    data_retirada = timezone.now()

    if data_prevista_devolucao is None:
        data_prevista_devolucao = (
            data_retirada.date() + timedelta(days=14)
        )

    if data_prevista_devolucao < data_retirada.date():
        raise ValidationError(
            'A data de devolução não pode ser menor que a data de retirada'
        )

    emprestimo = Emprestimo.objects.create(
        pedido = pedido,
        exemplar = exemplar,
        data_retirada = data_retirada,
        data_retirada = data_retirada,
        data_prevista_devolucao = data_prevista_devolucao,
    )

    exemplar.status = "emprestado"
    exemplar.save(update_fields=["status"])

    return emprestimo   