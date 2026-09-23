from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

    
class Livro(models.Model):
    STATUS_CHOICES = [
        ("disponível", "Disponível"),
        ("reservado", "Reservado"),
        ("emprestado", "Emprestado"),
        ("indisponivel", "Indisponível"),
    ]
    titulo = models.CharField(max_length = 200)
    autor = models.CharField(max_length = 200)
    sinopse = models.CharField(max_length=1000, blank=True)
    editora = models.CharField(max_length = 200)
    generos = models.CharField(max_length=90, blank=True)
    ano = models.PositiveIntegerField(
        validators = [MinValueValidator(1000), MaxValueValidator(9999)]
    )
    status = models.CharField(max_length = 20,
                               choices = STATUS_CHOICES,
                               default = "disponível")
    capa = models.ImageField(upload_to="capas/", blank=True)
    def __str__(self):
        return self.titulo

