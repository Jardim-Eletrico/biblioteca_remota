from rest_framework import serializers
from .models import ListaDesejo


class ListaDesejoSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(
        source="edicao.livro.titulo",
        read_only=True
    )

    autor = serializers.CharField(
        source="edicao.livro.autor",
        read_only=True
    )

    capa = serializers.ImageField(
        source="edicao.capa",
        read_only=True
    )

    cdd = serializers.CharField(
        source="edicao.livro.cdd.codigo",
        read_only=True,
        allow_null=True
    )

    tem_exemplares_disponiveis = serializers.SerializerMethodField()

    def get_tem_exemplares_disponiveis(self, obj):
        return obj.edicao.exemplares.filter(
            status="disponivel"
        ).exists()

    class Meta:
        model = ListaDesejo
        fields = [
            "id",
            "edicao",
            "titulo",
            "autor",
            "capa",
            "cdd",
            "tem_exemplares_disponiveis",
            "data_adicao",
        ]