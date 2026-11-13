
from rest_framework import serializers

from .models import Pedido


from rest_framework import serializers

from .models import Pedido


class PedidoSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(
        source="edicao.livro.titulo",
        read_only=True
    )

    autor = serializers.CharField(
        source="edicao.livro.autor",
        read_only=True
    )

    nome_leitor = serializers.CharField(
        source="leitor.usuario.nome",
        read_only=True
    )

    exemplar = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = Pedido
        fields = (
            "id",
            "leitor",
            "nome_leitor",
            "edicao",
            "titulo",
            "autor",
            "exemplar",
            "status",
            "data_pedido",
            "data_resposta",
        )

        read_only_fields = (
            "id",
            "leitor",
            "titulo",
            "autor",
            "exemplar",
            "status",
            "data_pedido",
            "data_resposta",
        )


class PedidoResponderSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=["aprovado", "recusado"]
    )

class PedidoResponderSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=["aprovado", "recusado"]
    )
