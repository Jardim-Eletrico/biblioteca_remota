from datetime import timedelta
from django.contrib.auth.hashers import check_password
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from pedidos.models import Pedido, Reserva
from livros.models import Exemplar, Edicao
from .models import Emprestimo, CodigoConfirmacao

from .confirmacao_service import gerar_e_enviar_codigo
from notificacoes.services import (notificar_usuarios_lista_desejos, notificar_aprovacao_pedido, notificar_emprestimo_efetivado)

def efetivar_emprestimo(
    pedido_id,
    exemplar_id,
    codigo_confirmacao,
):
    erro_codigo = None
    emprestimo = None

    with transaction.atomic():
        pedido = Pedido.objects.select_for_update().get(
            pk=pedido_id
        )

        reserva = Reserva.objects.select_for_update().get(
            pk=pedido.reserva_id
        )

        exemplar = Exemplar.objects.select_for_update().get(
            pk=exemplar_id
        )

        if pedido.status != "aprovado":
            raise ValidationError(
                "O pedido deve estar aprovado."
            )

        if hasattr(pedido, "emprestimo"):
            raise ValidationError(
                "Este pedido já tem um empréstimo."
            )

        if pedido.exemplar_id is None:
            raise ValidationError(
                "Este pedido não possui exemplar reservado."
            )

        if pedido.exemplar_id != exemplar.pk:
            raise ValidationError(
                "Este não é o exemplar reservado para este pedido."
            )

        if exemplar.status != "reservado":
            raise ValidationError(
                "O exemplar não está reservado."
            )

        if exemplar.edicao_id != pedido.edicao_id:
            raise ValidationError(
                "O exemplar não pertence à edição solicitada."
            )

        codigo_obj = CodigoConfirmacao.objects.select_for_update().filter(
            reserva=reserva
        ).first()

        if codigo_obj is None:
            erro_codigo = "Esta reserva não possui código de confirmação."

        elif codigo_obj.utilizado:
            erro_codigo = "Este código já foi utilizado."

        elif codigo_obj.tentativas >= 5:
            erro_codigo = (
                "Limite de tentativas atingido. "
                "Solicite o envio de um novo código."
            )

        elif codigo_obj.data_expiracao <= timezone.now():
            erro_codigo = (
                "O código de confirmação expirou. "
                "Solicite um novo código."
            )

        elif not check_password(
            codigo_confirmacao,
            codigo_obj.codigo_hash,
        ):
            codigo_obj.tentativas += 1
            codigo_obj.save(update_fields=["tentativas"])

            erro_codigo = "Código de confirmação incorreto."

        if erro_codigo is None:
            data_retirada = timezone.now()

            data_prevista_devolucao = (
                timezone.localdate(data_retirada) +
                timedelta(weeks=pedido.prazo_semanas)
            )

            emprestimo = Emprestimo.objects.create(
                pedido=pedido,
                exemplar=exemplar,
                data_retirada=data_retirada,
                data_prevista_devolucao=data_prevista_devolucao,
            )

            exemplar.status = "emprestado"
            exemplar.save(update_fields=["status"])

            # Verificar se ainda existem pedidos ativos
            # sem empréstimo nesta reserva.
            pedidos_pendentes = reserva.pedidos.filter(
                status__in=["pendente", "aprovado"],
                emprestimo__isnull=True,
            ).exists()

            if not pedidos_pendentes:
                codigo_obj.utilizado = True
                codigo_obj.save(update_fields=["utilizado"])

            notificar_emprestimo_efetivado(emprestimo)

    # A tentativa incorreta precisa ser confirmada no banco
    # antes de lançar a exceção.
    if erro_codigo:
        raise ValidationError(erro_codigo)

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
    emprestimo.situacao_encerramento = (
        Emprestimo.SituacaoEncerramento.DEVOLVIDO
    )

    emprestimo.save(update_fields=[
        "data_devolucao",
        "situacao_encerramento",
    ])

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

        transaction.on_commit(
            lambda: gerar_e_enviar_codigo(pedido.reserva)
        )

        return emprestimo

    exemplar.status = "disponivel"
    exemplar.save(update_fields=["status"])

    notificar_usuarios_lista_desejos(edicao)

    return emprestimo

@transaction.atomic
def regularizar_emprestimo(emprestimo_id, motivo):
    try:
        emprestimo = (
            Emprestimo.objects
            .select_for_update()
            .get(pk=emprestimo_id)
        )
    except Emprestimo.DoesNotExist:
        raise ValidationError("Empréstimo não encontrado.")

    if emprestimo.situacao_encerramento != Emprestimo.SituacaoEncerramento.PERDIDO:
        raise ValidationError(
            "Somente empréstimos encerrados como perdidos podem ser regularizados."
        )

    if emprestimo.regularizado:
        raise ValidationError(
            "Este empréstimo já foi regularizado."
        )

    motivo = motivo.strip()

    if not motivo:
        raise ValidationError(
            "Informe o motivo da regularização."
        )

    emprestimo.regularizado = True
    emprestimo.data_regularizacao = timezone.now()
    emprestimo.motivo_regularizacao = motivo

    emprestimo.save(
        update_fields=[
            "regularizado",
            "data_regularizacao",
            "motivo_regularizacao",
        ]
    )

    return emprestimo