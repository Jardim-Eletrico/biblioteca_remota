from django.contrib import admin
from .models import Notificacao


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = (
        "usuario",
        "titulo",
        "lida",
        "data_criacao",
    )

    list_filter = ("lida", "data_criacao")
    search_fields = ("usuario__email", "titulo")