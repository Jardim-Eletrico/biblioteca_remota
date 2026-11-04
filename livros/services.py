from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from livros.models import Avaliacao, Livro
from usuarios.models import Leitor
from emprestimos.models import Emprestimo

@transaction.atomic
def avaliar_livro(leitor, livro, nota):

    if not isinstance(nota, int) or isinstance(nota, bool) or not 1 <= nota <= 5:
        raise ValidationError(
            "A nota deve ser um número inteiro entre 1 e 5"
        )

    emprestimo_devolvido = Emprestimo.objects.filter(
        pedido__leitor=leitor,
        exemplar__edicao__livro=livro,
        data_devolucao__isnull=False
    ).exists()

    if not emprestimo_devolvido:
        raise ValidationError(
            "Você precisa devolver o livro antes de avaliá-lo"
        )

    ultima_avalicao = Avaliacao.objects.filter(
        leitor=leitor,
        livro=livro
    ).order_by("-data_avaliacao").first()

    if ultima_avalicao:
        intervalo = timezone.now() - ultima_avalicao.data_avaliacao

        if intervalo < timedelta(days=7):
            raise ValidationError(
                "Você precisa aguardar pelo menos 7 dias "
                "desde a sua última avaliação deste mesmo livro"
            )

    avalicao = Avaliacao.objects.create(
        leitor = leitor,
        livro = livro,
        nota = nota
    )

    return avalicao