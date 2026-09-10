from django.db import models
from livros.models import Livro
# Create your models here.
class Usuario(models.Model):
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    senha = models.CharField(max_length=20)

    def ver_acervo(self):
        return Livro.objects.all()

    class Meta:
        abstract = True
    def __str__(self):
            return self.nome

class Leitor(Usuario):
    def reservar_livro(self):
         pass

    def minhas_reservas(self):
         pass
    

class Bibliotecario(Usuario):
    matricula = models.CharField(max_length=5, unique=True)
    

    def cadastrar_livro(self,livro):
          livro.save()
         
    def excluir_livro(self, livro):
         livro.delete()

    def editar_livro(self, livro):
         livro.save()

    def ver_leitores(self, leitores):
         leitores.get()