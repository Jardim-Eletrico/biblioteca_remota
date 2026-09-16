from django.db import models
from usuarios.models import Leitor
from livros.models import Livro

# Create your models here.
class Emprestimo(models.Model):

    leitor = models.ForeignKey(
        Leitor,
        on_delete=models.CASCADE
    )

    livro = models.ForeignKey(
        Livro,
        on_delete=models.CASCADE
    )

    data_emprestimo = models.DateTimeField(
        auto_now_add=True
    )

    data_devolucao = models.DateTimeField(
        null=True,
        blank=True
    )

    data_prevista_devolucao = models.DateTimeField()