from rest_framework import serializers
from livros.models import *
from usuarios.models import *

class LivroSerializer(serializers.ModelSerializer):
 
     #Faz a serialização com base numa model ja existente
    class Meta: #pega a model Livro
        model = Livro
        fields = "__all__" #pega todos seus atributos

    def validate_isbn(self, value):
        return value or None 

    def validate_titulo(self, value):
        if not value.strip():
            raise serializers.ValidationError("O título é obrigatório.")
        return value.strip()
    
    def create(self, validated_data):
        quantidade = validated_data.pop('quantidade') #O pop exclui o item do dicionario enviado pelo cliente, mas guarda suas informações para o cadastro

        livro = Livro.objects.create(**validated_data)

        for i in range(quantidade):
            Exemplar.objects.create(livro=livro)

        return livro

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = (
            "id",
            "email",
            "password",
            "nome",
        )
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data): #Cria um usuário já com hash em seus dados.
        usuario = Usuario.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            nome=validated_data["nome"],
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
