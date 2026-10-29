from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from livros.models import *
from usuarios.models import *
from emprestimos.models import Emprestimo
from pedidos.models import Pedido

import random
import string


class LivroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livro
        fields = "__all__"

    def validate_isbn(self, value):
        return value or None

    def validate_titulo(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "O título é obrigatório."
            )
        return value.strip()

class EdicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edicao
        fields = "__all__"

class ExemplarLoteSerializer(serializers.Serializer):
    quantidade = serializers.IntegerField(
        min_value=1,
        max_value=100,
    )   

    @transaction.atomic
    def create(self, validated_data):
        edicao = self.context["edicao"]
        quantidade = validated_data["quantidade"]

        exemplares = [
            Exemplar(edicao=edicao)
            for _ in range(quantidade)
        ]

        return Exemplar.objects.bulk_create(exemplares)
#---------------------------------------------------------
class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = (
            'id',
            'leitor',
            'edicao',
            'status',
            'data_pedido',
            'data_resposta',
        )
        read_only_fields = (
            'id',
            'leitor',
            'status',
            'data_pedido',
            'data_resposta',
        )

class PedidoResponderSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=['aprovado', 'recusado']
    )

class EfetivarEmprestimoSerializer(serializers.Serializer):
    exemplar_id = serializers.PrimaryKeyRelatedField(
        queryset=Exemplar.objects.all(),
        source='exemplar',
    )

    data_prevista_devolucao = serializers.DateField(
        required=False,
    )

#---------------------------------------------------------
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
