from django.db import models
from django.utils import timezone
from datetime import timedelta


def calcular_devolucao_padrao():
    return timezone.localdate() + timedelta(days=14)

# Create your models here.
class Emprestimo(models.Model):
    pedido = models.OneToOneField(
        'pedidos.Pedido',
        on_delete=models.PROTECT,
        related_name='emprestimo',
        )

    exemplar = models.ForeignKey(
        'livros.Exemplar',
        on_delete=models.PROTECT,
        related_name='emprestimos',
    )

    data_retirada = models.DateTimeField(
        default=timezone.now
    )

    data_prevista_devolucao = models.DateField(
        default=calcular_devolucao_padrao
    )

    data_devolucao = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ['-data_retirada']

    def __str__(self):
        return (
            f'Empréstimo #{self.pk} -'
            f'{self.pedido.leitor} -'
            f'{self.exemplar.tombo}'
        )


#CODIGO DE CONFIRMACAO
class CodigoConfirmacao(models.Model):
    pedido = models.OneToOneField(
        "pedidos.Pedido",
        on_delete=models.CASCADE,
        related_name="codigo_confirmacao"
    )

    codigo_hash = models.CharField(max_length=128)
    data_expiracao = models.DateTimeField()
    utilizado = models.BooleanField(default=False)
    tentativas = models.PositiveIntegerField(default=0)
