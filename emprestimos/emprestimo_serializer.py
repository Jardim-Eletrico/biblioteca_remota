
from rest_framework import serializers

from django.utils import timezone

from .models import Emprestimo
from livros.models import Exemplar

class EfetivarEmprestimoSerializer(serializers.Serializer):
    exemplar_id = serializers.PrimaryKeyRelatedField(
        queryset=Exemplar.objects.all(),
        source='exemplar',
    )

    codigo_confirmacao = serializers.RegexField(
        regex=r"^\d{6}$",
        write_only=True,
        error_messages = {
            "invalid": "O código de confirmação deve ter 6 dígitos"
        }
    )

    data_prevista_devolucao = serializers.DateField(
        required=False,
    )

class EmprestimoSerializer(serializers.ModelSerializer):
    leitor = serializers.CharField(
        source = 'pedido.leitor.usuario.nome',
        read_only = True
    )

    livro = serializers.CharField(
        source = "pedido.edicao.livro.titulo",
        read_only = True
    )

    tombo = serializers.CharField(
        source = "exemplar.tombo",
        read_only = True
    )

    situacao = serializers.SerializerMethodField()

    def get_situacao(self, obj):
        if obj.data_devolucao is not None:
            return "Devolvido"

        if obj.data_prevista_devolucao < timezone.localdate():
            return "Atrasado"

        return "Em andamento"

    class Meta:
        model = Emprestimo
        fields = [
            "id",
            "leitor",
            "livro",
            "tombo",
            "data_retirada",
            "data_prevista_devolucao",
            "data_devolucao",
            "situacao",
            ]