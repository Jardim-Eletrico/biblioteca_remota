from django.contrib.auth.models import AbstractUser
from django.db import models
# Create your models here.

class Usuario(AbstractUser):
     nome = models.CharField(max_length=200)
     email = models.EmailField(unique=True)
     cpf = models.CharField(max_length=11, unique=True)

     def __str__(self):
          return self.nome

class Leitor(models.Model):
     usuario = models.OneToOneField(
          Usuario,
          on_delete=models.CASCADE,
          related_name="leitor"
     )
     def __str__(self):
               return self.usuario.nome

     def efetuar_emprestimo(self, livro):
          pass
     def reservar_livro(self):
          pass
     def minhas_reservas(self):
          pass
    


class Bibliotecario(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="bibliotecario"
    )
    def __str__(self):
              return self.usuario.nome
    matricula = models.CharField(max_length=5, unique=True)

    def cadastrar_livro(self, livro):
        livro.save()

    def excluir_livro(self, livro):
        livro.delete()

    def editar_livro(self, livro):
        livro.save()

    def ver_leitores(self, leitores):
        return leitores.all()
