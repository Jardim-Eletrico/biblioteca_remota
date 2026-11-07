from django.db import models
from django.conf import settings


class Notificacao(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notificacoes"
    )

    emprestimo = models.ForeignKey(
            'emprestimos.Emprestimo',
            on_delete=models.SET_NULL,
            null=True,
            blank=True,
            related_name='notificacoes'
        )
    
    titulo = models.CharField(max_length=150)
    mensagem = models.TextField()

    

    lida = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-data_criacao"]

    def __str__(self):
        return self.titulo