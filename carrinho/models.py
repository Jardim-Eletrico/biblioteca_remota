from django.db import models
from django.conf import settings


class Carrinho(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="carrinho"
    )

    data_criacao = models.DateTimeField(auto_now_add=True)


class ItemCarrinho(models.Model):
    carrinho = models.ForeignKey(
        Carrinho,
        on_delete=models.CASCADE,
        related_name="itens"
    )

    edicao = models.ForeignKey(
        "livros.Edicao",
        on_delete=models.CASCADE,
        related_name="itens_carrinho"
    )

    data_adicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["carrinho", "edicao"],
                name="unique_edicao_carrinho"
            )
        ]