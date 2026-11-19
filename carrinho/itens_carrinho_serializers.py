from rest_framework import serializers
from .models import ItemCarrinho

class ItemCarrinhoSerializer(serializers.ModelSerializer):

    edicaoId = serializers.IntegerField(
        source="edicao.id",
        read_only=True
    )

    livroId = serializers.IntegerField(
        source="edicao.livro.id",
        read_only=True
    )

    titulo = serializers.CharField(
        source="edicao.livro.titulo",
        read_only=True
    )

    editora = serializers.CharField(
        source="edicao.editora",
        read_only=True
    )


    exemplaresDisponiveis = serializers.SerializerMethodField()

    def get_exemplaresDisponiveis(self, obj):
        return obj.edicao.exemplares.filter(
            status="disponivel"
        ).count()


    capa = serializers.ImageField(
        source="edicao.capa",
        read_only=True
    )

    class Meta:
        model = ItemCarrinho
        fields = [
            "id",
            "edicaoId",
            "livroId",
            "titulo",
            "editora",
            "capa",
            "exemplaresDisponiveis",
        ]
