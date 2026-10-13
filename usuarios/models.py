from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
# Create your models here.

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório.")

        email = self.normalize_email(email)
        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("O superusuário precisa ter is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("O superusuário precisa ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)



class Usuario(AbstractUser):
     username = None
     nome = models.CharField(max_length=200)
     email = models.EmailField(unique=True)
     cpf = None
     
     objects = UsuarioManager()

     USERNAME_FIELD = "email"
     REQUIRED_FIELDS = []   


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
