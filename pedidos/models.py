from django.db import models

# Create your models here.

from django.db import models
from django.utils import timezone


class Pedido(models.Model):
    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("aprovado", "Aprovado"),
        ("recusado", "Recusado"),
        ("cancelado", "Cancelado"),
    ]

    leitor = models.ForeignKey(
        "usuarios.Leitor",
        on_delete=models.CASCADE,
        related_name="pedidos",
    )

    edicao = models.ForeignKey(
        "livros.Edicao",
        on_delete=models.PROTECT,
        related_name="pedidos",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pendente",
    )

    data_pedido = models.DateTimeField(
        auto_now_add=True,
    )

    data_resposta = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-data_pedido"]

    def __str__(self):
        return (
            f"Pedido #{self.pk} "
            f"{self.leitor} "
            f"{self.edicao.livro.titulo}"
        )
