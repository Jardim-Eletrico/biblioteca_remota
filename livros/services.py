from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from livros.models import Avaliacao, Livro
from usuarios.models import Leitor
from emprestimos.models import Emprestimo

from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from livros.models import Avaliacao, Livro
from usuarios.models import Leitor
from emprestimos.models import Emprestimo


@transaction.atomic
def avaliar_livro(leitor, livro, nota):

    # Validar a nota
    if (
        not isinstance(nota, int)
        or isinstance(nota, bool)
        or not 1 <= nota <= 5
    ):
        raise ValidationError(
            "A nota deve ser um número inteiro entre 1 e 5"
        )

    leitor = Leitor.objects.select_for_update().get(
        pk=leitor.pk
    )

    emprestimos = Emprestimo.objects.filter(
        pedido__leitor=leitor,
        exemplar__edicao__livro=livro
    )

    emprestimo_devolvido = emprestimos.filter(
        data_devolucao__isnull=False
    ).exists()

    if not emprestimo_devolvido:
        raise ValidationError(
            "Você precisa devolver o livro antes de avaliá-lo"
        )

    emprestimo_ativo = emprestimos.filter(
        data_devolucao__isnull=True
    ).exists()

    if emprestimo_ativo:
        raise ValidationError(
            "Você não pode avaliar este livro enquanto "
            "possuir um empréstimo ativo dele"
        )

    avaliacao = Avaliacao.objects.filter(
        leitor=leitor,
        livro=livro
    ).first()

    if avaliacao:

        intervalo = timezone.now() - avaliacao.data_avaliacao

        if intervalo < timedelta(days=7):
            raise ValidationError(
                "Você precisa aguardar pelo menos 7 dias "
                "desde a sua última avaliação deste livro"
            )

        avaliacao.nota = nota
        avaliacao.data_avaliacao = timezone.now()

        avaliacao.save(update_fields=[
            "nota",
            "data_avaliacao"
        ])

        return avaliacao

    # Criar avaliação caso ainda não exista
    avaliacao = Avaliacao.objects.create(
        leitor=leitor,
        livro=livro,
        nota=nota
    )

    return avaliacao