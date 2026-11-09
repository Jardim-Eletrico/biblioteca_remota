from django.db import transaction

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    Usuario,
    Leitor,
    Bibliotecario,
)

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
    @transaction.atomic
    def create(self, validated_data): #Cria um usuário já com hash em seus dados.
        usuario = Usuario.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            nome=validated_data["nome"],
        )

        Leitor.objects.create(usuario = usuario)

        return usuario

class BibliotecarioCadastroSerializer(serializers.ModelSerializer):
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
    @transaction.atomic
    def create(self, validated_data): #Cria um usuário já com hash em seus dados.
        usuario = Usuario.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            nome=validated_data["nome"],
        )

        Bibliotecario.objects.create(usuario = usuario)

        return usuario
    
class LeitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leitor
        fields = "__all__" 

class BibliotecarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bibliotecario
        fields = "__all__" 

class LoginSerializer(TokenObtainPairSerializer):
    username_field = Usuario.USERNAME_FIELD

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        attrs[Usuario.USERNAME_FIELD] = attrs.pop("email")
        return super().validate(attrs)

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class MeuPerfilSerializer(serializers.ModelSerializer):
    perfis = serializers.SerializerMethodField()
    leitor_id = serializers.SerializerMethodField()
    bibliotecario_id = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            "id",
            "nome",
            "email",
            "perfis",
            "leitor_id",
            "bibliotecario_id",
        ]

    def get_perfis(self, obj):
        perfis = []

        if hasattr(obj, "leitor"):
            perfis.append("leitor")

        if hasattr(obj, "bibliotecario"):
            perfis.append("bibliotecario")

        return perfis or ["sem_perfil"]

    def get_leitor_id(self, obj):
        if hasattr(obj, "leitor"):
            return obj.leitor.pk

        return None

    def get_bibliotecario_id(self, obj):
        if hasattr(obj, "bibliotecario"):
            return obj.bibliotecario.pk

        return None
#---------------------------------------------------------
class SolicitarRecuperacaoSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ValidarCodigoSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(
        min_length=6,
        max_length=6,
    )

class RedefinirSenhaSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(
        min_length=6,
        max_length=6,
    )
    nova_senha = serializers.CharField(
        min_length=8,
        write_only=True,
    )
