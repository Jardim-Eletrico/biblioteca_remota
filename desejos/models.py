from django.db import models
from livros.models import Edicao
# Create your models here.
from django.conf import settings


class ListaDesejo(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lista_desejos"
    )

    edicao = models.ForeignKey(
        Edicao,
        on_delete=models.CASCADE,
        related_name="desejos"
    )

    data_adicao = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "edicao"],
                name="desejo_unico_por_usuario_edicao"
            )
        ]