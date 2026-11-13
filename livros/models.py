from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import random
import string

import re
from django.core.exceptions import ValidationError



def validar_ano_original(valor):
    padrao = r"^(c\.\s*)?\d{1,4}(\s*(a\.C\.|d\.C\.))?$"

    if not re.fullmatch(padrao, valor.strip()):
        raise ValidationError(
            "Informe um ano válido. Exemplos: 1880, 1937, c. 340 a.C."
        )

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
    
    titulo = models.CharField(max_length = 200)
    subtitulo = models.CharField(max_length = 200, blank=True)
    autor = models.CharField(max_length = 200)
    descricao = models.CharField(max_length=1000, blank=True)
    generos = models.CharField(max_length=90, blank=True)
    ano_original = models.CharField(
    max_length=30,
    validators=[validar_ano_original]
    )
    def __str__(self):
        return self.titulo




class Edicao(models.Model):
    livro = models.ForeignKey(Livro, on_delete=models.PROTECT, related_name="edicoes")

    ano_publicacao = models.PositiveIntegerField(
                validators = [MinValueValidator(1000), MaxValueValidator(9999)]
            )

    editora = models.CharField(max_length = 200)
    numero_paginas = models.IntegerField(null=True)
    edicao = models.CharField(max_length=20, null=True)
    capa = models.ImageField(upload_to="capas/", blank=True)
    isbn = models.CharField(max_length=17, unique=True, null=True, blank=True)
    data_de_criacao = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.livro.titulo} - {self.editora}"

def gerar_tombo():
    while True:
        caracteres = string.ascii_uppercase + string.digits
        tombo = "".join(random.choices(caracteres, k=5))

        if not Exemplar.objects.filter(tombo=tombo).exists():
            return tombo

class Exemplar(models.Model):
    STATUS_CHOICES = [
        ("disponivel", "Disponível"),
        ("reservado", "Reservado"),
        ("emprestado", "Emprestado"),
        ("indisponivel", "Indisponível"),
        ("baixado", "Baixado"),
    ]

    tombo = models.CharField(
        max_length=5,
        unique=True,
        default=gerar_tombo
    )
    edicao = models.ForeignKey(
        Edicao,
        on_delete=models.PROTECT,
        related_name="exemplares",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="disponivel"
    )

    data_baixa = models.DateTimeField(
        null=True,
        blank=True
    )

    motivo_baixa = models.TextField(
        null=True,
        blank=True
    )

    def __str__(self):
            return f"{self.edicao.livro.titulo} - {self.tombo}"

class Avaliacao(models.Model):
    leitor = models.ForeignKey(
        "usuarios.Leitor",
        on_delete=models.CASCADE,
        related_name='avaliacoes'
    )
    livro = models.ForeignKey(
        "livros.Livro",
        on_delete=models.CASCADE,
        related_name="avaliacoes"
    )
    nota = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    data_avaliacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(nota__gte=1, nota__lte=5),
                name="nota_entre_1_e_5"
            ),

            models.UniqueConstraint(
                fields=["leitor", "livro"], #impede registros com mesma combinação de leitor e livro
                name="avaliacao_unica_por_leitor_livro",
            )
        ]

    def __str__(self):
        return f"{self.livro} - {self.nota} estrelas"

    
