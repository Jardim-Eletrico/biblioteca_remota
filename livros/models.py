from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class CDD(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.CharField(max_length=200)

    pai = models.ForeignKey(
        "self",
        on_delete=models.PROTECT, #NÃO PERMITE EXCLUSÃO CASO A CDD JÁ ESTEJA SENDO USADA
        null=True,
        blank=True,
        related_name="subclasses",
    )

    def __str__(self):
        return f"{self.codigo} - {self.descricao}"
    
class Livro(models.Model):
    cdd = models.ForeignKey(
        CDD,
        on_delete=models.PROTECT,
        related_name="livros",
        null=True,
        blank=True
    )
    STATUS_CHOICES = [
        ("disponível", "Disponível"),
        ("reservado", "Reservado"),
        ("emprestado", "Emprestado"),
        ("indisponivel", "Indisponível"),
    ]
    titulo = models.CharField(max_length = 200)
    subtitulo = models.CharField(max_length = 200, blank=True)
    autor = models.CharField(max_length = 200)
    descricao = models.CharField(max_length=1000, blank=True)
    editora = models.CharField(max_length = 200)
    generos = models.CharField(max_length=90, blank=True)
    ano = models.PositiveIntegerField(
        validators = [MinValueValidator(1000), MaxValueValidator(9999)]
    )
    numero_paginas = models.IntegerField(null=True)
    edicao = models.CharField(max_length=20, null=True),
    status = models.CharField(max_length = 20,
                               choices = STATUS_CHOICES,
                               default = "disponível")
    capa = models.ImageField(upload_to="capas/", blank=True)
    isbn = models.CharField(max_length=17, unique=True, null=True, blank=True)
    def __str__(self):
        return self.titulo

