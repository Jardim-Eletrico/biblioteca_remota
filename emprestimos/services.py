
from django.contrib.auth.hashers import check_password
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from pedidos.models import Pedido
from livros.models import Exemplar, Edicao
from .models import Emprestimo, CodigoConfirmacao, calcular_devolucao_padrao

from .confirmacao_service import gerar_e_enviar_codigo
from notificacoes.services import (notificar_usuarios_lista_desejos, notificar_aprovacao_pedido, notificar_emprestimo_efetivado)

def efetivar_emprestimo(
    pedido_id,
    exemplar_id,
    codigo_confirmacao,
    data_prevista_devolucao=None,
):
    erro_codigo = None
    emprestimo = None

    with transaction.atomic():
        pedido = Pedido.objects.select_for_update().get(
            pk=pedido_id
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
            pedido=pedido
        ).first()

        if codigo_obj is None:
            erro_codigo = "Este pedido não possui código de confirmação."

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

            if data_prevista_devolucao is None:
                data_prevista_devolucao = calcular_devolucao_padrao()

            if data_prevista_devolucao < data_retirada.date():
                raise ValidationError(
                    "A data de devolução não pode ser menor que a data de retirada."
                )

            emprestimo = Emprestimo.objects.create(
                pedido=pedido,
                exemplar=exemplar,
                data_retirada=data_retirada,
                data_prevista_devolucao=data_prevista_devolucao,
            )

            exemplar.status = "emprestado"
            exemplar.save(update_fields=["status"])

            codigo_obj.utilizado = True
            codigo_obj.save(update_fields=["utilizado"])

            notificar_emprestimo_efetivado(emprestimo)

    # A tentativa incorreta precisa ser confirmada no banco
    # antes de lançar a exceção. Por isso, o erro é lançado
    # depois que a transação termina.
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
        transaction.on_commit(
            lambda: gerar_e_enviar_codigo(pedido)
        )

        return emprestimo

    exemplar.status = "disponivel"
    exemplar.save(update_fields=["status"])

    notificar_usuarios_lista_desejos(edicao)

    return emprestimo