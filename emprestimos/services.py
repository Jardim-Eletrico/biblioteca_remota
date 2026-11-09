from .models import Emprestimo, calcular_devolucao_padrao

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from pedidos.models import Pedido
from livros.models import Exemplar, Edicao
from .models import Emprestimo

from notificacoes.services import (notificar_usuarios_lista_desejos, notificar_aprovacao_pedido, notificar_emprestimo_efetivado)

@transaction.atomic
def efetivar_emprestimo(
    pedido_id,
    exemplar_id,
    data_prevista_devolucao=None,
):
    pedido = Pedido.objects.select_for_update().get(
        pk=pedido_id
    )

    exemplar = Exemplar.objects.select_for_update().get(
        pk=exemplar_id
    )

    if pedido.status != 'aprovado':
        raise ValidationError(
            'O pedido deve estar aprovado'
        )

    if hasattr(pedido, 'emprestimo'):
        raise ValidationError(
            'Este pedido já tem um empréstimo'
        )

    if pedido.exemplar_id is None:
        raise ValidationError(
            'Este pedido não possui exemplar reservado'
        )

    if pedido.exemplar_id != exemplar.pk:
        raise ValidationError(
            'Este não é o exemplar reservado para este pedido'
        )

    if exemplar.status != 'reservado':
        raise ValidationError(
            'O exemplar não está reservado'
        )

    if exemplar.edicao_id != pedido.edicao_id:
        raise ValidationError(
            'O exemplar não pertence à edição solicitada'
        )

    data_retirada = timezone.now()

    if data_prevista_devolucao is None:
        data_prevista_devolucao = calcular_devolucao_padrao()

    if data_prevista_devolucao < data_retirada.date():
        raise ValidationError(
            'A data de devolução não pode ser menor que a data de retirada'
        )

    emprestimo = Emprestimo.objects.create(
        pedido=pedido,
        exemplar=exemplar,
        data_retirada=data_retirada,
        data_prevista_devolucao=data_prevista_devolucao,
    )

    exemplar.status = "emprestado"
    exemplar.save(update_fields=["status"])

    notificar_emprestimo_efetivado(emprestimo)

    return emprestimo

@transaction.atomic
def devolver_emprestimo(emprestimo_id):
    emprestimo = Emprestimo.objects.select_for_update().get(
        pk=emprestimo_id
    )

    if emprestimo.data_devolucao is not None:
        raise ValidationError(
            "Este livro já foi devolvido"
        )

    edicao_id = Exemplar.objects.values_list(
        "edicao_id",
        flat=True
    ).get(pk=emprestimo.exemplar_id)

    edicao = Edicao.objects.select_for_update().get(
        pk=edicao_id
    )

    exemplar = Exemplar.objects.select_for_update().get(
        pk=emprestimo.exemplar_id
    )

    emprestimo.data_devolucao = timezone.now()
    emprestimo.save(update_fields=["data_devolucao"])

    pedido = Pedido.objects.select_for_update().filter(
        edicao=edicao,
        status="pendente"
    ).order_by(
        "data_pedido",
        "id"
    ).first()

    if pedido:
        pedido.exemplar = exemplar
        pedido.status = "aprovado"
        pedido.data_resposta = timezone.now()

        pedido.save(update_fields=[
            "exemplar",
            "status",
            "data_resposta"
        ])

        exemplar.status = "reservado"
        exemplar.save(update_fields=["status"])

        notificar_aprovacao_pedido(pedido)

        return emprestimo

    exemplar.status = "disponivel"
    exemplar.save(update_fields=["status"])

    notificar_usuarios_lista_desejos(edicao)

    return emprestimo