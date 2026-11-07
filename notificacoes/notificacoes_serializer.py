from rest_framework import serializers
from .models import Notificacao


class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = [
            "id",
            "titulo",
            "mensagem",
            "lida",
            "data_criacao",
        ]

        read_only_fields = [
            "id",
            "titulo",
            "mensagem",
            "data_criacao",
        ]