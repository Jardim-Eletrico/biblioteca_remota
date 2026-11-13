from rest_framework import serializers

from django.db import transaction

from .models import (
    Livro,
    Edicao,
    Exemplar,
)
from emprestimos.models import Emprestimo

class LivroSerializer(serializers.ModelSerializer):

    media_avaliacoes = serializers.FloatField(
        read_only = True,
        allow_null = True
    )

    quantidade_avaliacoes = serializers.IntegerField(
        read_only = True
    )

    class Meta:
        model = Livro
        fields = "__all__"

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


class LivroSerializer(serializers.ModelSerializer):
    edicoes = EdicaoSerializer(many=True, read_only=True)

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

class ExemplarPublicoSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(
        source="edicao.livro.titulo",
        read_only=True
    )

    autor = serializers.CharField(
        source="edicao.livro.autor",
        read_only=True
    )

    ano_publicacao = serializers.IntegerField(
        source="edicao.ano_publicacao",
        read_only=True
    )

    editora = serializers.CharField(
        source="edicao.editora",
        read_only=True
    )

    class Meta:
        model = Exemplar
        fields = [
            "id",
            "tombo",
            "status",
            "titulo",
            "autor",
            "ano_publicacao",
            "editora",
        ]


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

class ExemplarBaixaSerializer(serializers.Serializer):
    motivo_baixa = serializers.CharField(
        required = True,
        allow_blank = False
    )

class AvalicaoSerializer(serializers.Serializer):
    nota = serializers.IntegerField(
        min_value =1,
        max_value=5
    )

