from django.db import models
from usuarios.models import Leitor
from livros.models import Livro

# Create your models here.
class Pedido(models.Model):

    STATUS_CHOICES = [
    ("pendente", "Pendente"),
    ("aprovado", "Aprovado"),
    ("recusado", "Recusado"),
    ("cancelado", "Cancelado"),
    ]

    leitor = models.ForeignKey(Leitor, on_delete=models.CASCADE)

    livro = models.ForeignKey(Livro, on_delete=models.CASCADE)

    data_pedido = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pendente"
    )