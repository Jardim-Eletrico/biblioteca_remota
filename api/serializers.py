from rest_framework import serializers
from livros.models import Livro
from usuarios.models import *

class LivroSerializer(serializers.ModelSerializer): #Faz a serialização com base numa model ja existente
    class Meta: #pega a model Livro
        model = Livro
        fields = "__all__" #pega todos seus atributos


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = (
            "id",
            "username",
            "email",
            "password",
            "nome",
            "cpf",
        )
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data): #Cria um usuário já com hash em seus dados.
        usuario = Usuario.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            nome=validated_data["nome"],
            cpf=validated_data["cpf"],
        )

        return usuario
    
class LeitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leitor
        fields = "__all__" 

class BibliotecarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bibliotecario
        fields = "__all__" 

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only = True)