from rest_framework import serializers

from .models import Pedido

from livros.models import Edicao

from emprestimos.emprestimo_serializer import EmprestimoResumoSerializer


class PedidoSerializer(serializers.ModelSerializer):
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
        read_only = True
    )

    nome_leitor = serializers.CharField(
        source="leitor.usuario.nome",
        read_only=True
    )

    emprestimo = EmprestimoResumoSerializer(read_only = True)
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
            "capa",
            "exemplar",
            "prazo_semanas",
            "status",
            "data_pedido",
            "data_resposta",
            "emprestimo",
        )

        read_only_fields = (
            "id",
            "leitor",
            "titulo",
            "autor",
            "exemplar",
            "prazo_semanas",
            "status",
            "data_pedido",
            "data_resposta",
        )


class PedidoResponderSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=["aprovado", "recusado"]
    )

class PedidoCreateSerializer(serializers.Serializer):
    edicoes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Edicao.objects.all()
    )

    prazo = serializers.ChoiceField(
        choices=[
            (1, "1 semana"),
            (2, "2 semanas"),
        ]
    )

    def validate_edicoes(self, edicoes):
        if not edicoes:
            raise serializers.ValidationError(
                "Informe pelo menos uma edição."
            )

        if len(edicoes) > 2:
            raise serializers.ValidationError(
                "Você pode solicitar no máximo 2 edições."
            )

        ids = [edicao.pk for edicao in edicoes]

        if len(ids) != len(set(ids)):
            raise serializers.ValidationError(
                "Não repita edições."
            )

        return edicoes
