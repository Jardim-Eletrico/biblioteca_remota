from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Genero(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nome
    
class Livro(models.Model):
    STATUS_CHOICES = [
        ("disponível", "Disponível"),
        ("reservado", "Reservado"),
        ("emprestado", "Emprestado"),
        ("indisponivel", "Indisponível"),
    ]
    titulo = models.CharField(max_length = 200)
    autor = models.CharField(max_length = 200)
    sinopse = models.CharField(blank=True)
    editora = models.CharField(max_length = 200)
    generos = models.ManyToManyField(Genero)
    ano = models.PositiveIntegerField(
        validators = [MinValueValidator(1000), MaxValueValidator(9999)]
    )
    status = models.CharField(max_length = 20,
                               choices = STATUS_CHOICES,
                               default = "disponível")
    capa = models.ImageField(upload_to="capas/")
    def __str__(self):
        return self.titulo

