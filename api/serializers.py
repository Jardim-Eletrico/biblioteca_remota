from rest_framework import serializers
from livros.models import Livro
from usuarios.models import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

    def create(self, validated_data):
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

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = "email"
    
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError(
                "Email ou senha inválidos."
            )

        if not usuario.check_password(password):
            raise serializers.ValidationError(
                "Email ou senha inválidos."
            )

        if not usuario.is_active:
            raise serializers.ValidationError(
                "Usuário inativo."
            )

        refresh = self.get_token(usuario)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }