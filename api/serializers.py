from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from livros.models import *
from usuarios.models import *
from emprestimos.models import Emprestimo
from pedidos.models import Pedido

import random
import string


class LoginSerializer(TokenObtainPairSerializer):
    username_field = 'email'

#---------------------------------------------------------
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
    total_exemplares = serializers.SerializerMethodField()
    exemplares_disponiveis = serializers.SerializerMethodField()

    class Meta:
        model = Edicao
        fields = "__all__"

    def get_total_exemplares(self, obj):
        return obj.exemplares.count()

    def get_exemplares_disponiveis(self, obj):
        return obj.exemplares.filter(status='disponivel').count()

class ExemplarListSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(
        source = 'edicao.livro.titulo',
        read_only = True
    )

    autor = serializers.CharField(
        source = 'edicao.livro.autor',
        read_only = True
    )

    ano_original = serializers.IntegerField(
        source = 'edicao.livro.ano_original',
        read_only = True
    )

    editora = serializers.CharField(
        source = 'edicao.editora',
        read_only = True
    )

    ano_publicacao = serializers.IntegerField(
        source = 'edicao.ano_publicacao',
        read_only = True
    )

    numero_edicao = serializers.CharField(
        source = 'edicao.edicao',
        read_only = True
    )

    capa = serializers.ImageField(
        source = 'edicao.capa',
        read_only = True
    )

    emprestado = serializers.SerializerMethodField()
    leitor = serializers.SerializerMethodField()

    class Meta:
        model = Exemplar
        fields = [
            "id",
            "tombo",
            "status",
            "titulo",
            "autor",
            "ano_original",
            "ano_publicacao",
            "editora",
            "numero_edicao",
            "capa",
            "emprestado",
            "leitor",
        ]

    def get_emprestado(self, obj):
        return Emprestimo.objects.filter(
            exemplar=obj,
            data_devolucao__isnull = True
        ).exists()

    def get_leitor(self, obj):
        emprestimo = Emprestimo.objects.filter(
            exemplar = obj,
            data_devolucao__isnull = True
        ).select_related("pedido__leitor__usuario").first()

        if emprestimo:
            return emprestimo.pedido.leitor.usuario.nome

        return None

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

class AvalicaoSerializer(serializers.Serializer):
    nota = serializers.IntegerField(
        min_value =1,
        max_value=5
    )
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
    