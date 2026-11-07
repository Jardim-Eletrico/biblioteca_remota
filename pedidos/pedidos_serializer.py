from rest_framework import serializers

from .models import Pedido


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
