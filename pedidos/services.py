from django.db import transaction
from django.utils import timezone
from django.db.models import Q

from rest_framework.exceptions import ValidationError

from pedidos.models import Pedido
from livros.models import Exemplar, Edicao

from notificacoes.services import notificar_aprovacao_pedido, notificar_cancelamento_pedido


@transaction.atomic
def criar_pedido(leitor, edicao_id):

    edicao = Edicao.objects.select_for_update().get(
        pk=edicao_id
    )

    pedido_existente = Pedido.objects.filter(
        leitor=leitor,
        edicao=edicao,
    ).filter(
        Q(status="pendente") |
        Q(
            status="aprovado",
            emprestimo__isnull=True
        ) |
        Q(
            status="aprovado",
            emprestimo__data_devolucao__isnull=True
        )
    ).exists()

    if pedido_existente:
        raise ValidationError(
            "Você já possui um pedido ativo para esta edição."
        )
    
    quantidade_pedidos_ativos = Pedido.objects.filter(
        leitor=leitor,
    ).filter(
        Q(status="pendente") |
        Q(
            status="aprovado",
            emprestimo__isnull=True
        ) |
        Q(
            status="aprovado",
            emprestimo__data_devolucao__isnull=True
        )
    ).count()

    if quantidade_pedidos_ativos >= 2:
        raise ValidationError(
            "Você já atingiu o limite de 2 pedidos ativos."
        )

    exemplar = Exemplar.objects.select_for_update().filter(
        edicao=edicao,
        status="disponivel"
    ).order_by("id").first()

    pedido = Pedido.objects.create(
        leitor=leitor,
        edicao=edicao,
    )

    if exemplar:
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

    return pedido



@transaction.atomic
def cancelar_pedido(pedido_id):

    pedido = Pedido.objects.select_for_update().get(
        pk=pedido_id
    )

    if pedido.status in ["cancelado", "recusado"]:
        raise ValidationError(
            "Este pedido já foi encerrado."
        )

    if pedido.status not in ["pendente", "aprovado"]:
        raise ValidationError(
            "Este pedido não pode ser cancelado."
        )

    # Um pedido que já possui empréstimo não pode ser cancelado.
    if hasattr(pedido, "emprestimo"):
        raise ValidationError(
            "Este pedido já possui um empréstimo associado."
        )

    # Se estiver aprovado, precisa liberar o exemplar reservado.
    if pedido.status == "aprovado":

        if not pedido.exemplar_id:
            raise ValidationError(
                "Este pedido aprovado não possui exemplar associado."
            )

        edicao = Edicao.objects.select_for_update().get(
            pk=pedido.edicao_id
        )

        exemplar = Exemplar.objects.select_for_update().get(
            pk=pedido.exemplar_id
        )

        if exemplar.status != "reservado":
            raise ValidationError(
                "O exemplar não está reservado."
            )

        pedido.status = "cancelado"
        pedido.save(update_fields=["status"])

        notificar_cancelamento_pedido(pedido)

        proximo_pedido = Pedido.objects.select_for_update().filter(
            edicao=edicao,
            status="pendente"
        ).exclude(
            pk=pedido.pk
        ).order_by("data_pedido", "id").first()

        if proximo_pedido:
            proximo_pedido.exemplar = exemplar
            proximo_pedido.status = "aprovado"
            proximo_pedido.data_resposta = timezone.now()

            proximo_pedido.save(update_fields=[
                "exemplar",
                "status",
                "data_resposta"
            ])

            notificar_aprovacao_pedido(proximo_pedido)

            exemplar.status = "reservado"

        else:
            exemplar.status = "disponivel"
        
        exemplar.save(update_fields=["status"])

        return pedido

    # Pedido pendente: basta cancelar.
    pedido.status = "cancelado"
    pedido.save(update_fields=["status"])

    notificar_cancelamento_pedido(pedido)

    return pedido
