from django.contrib import admin
from .models import ListaDesejo


@admin.register(ListaDesejo)
class ListaDesejoAdmin(admin.ModelAdmin):
    list_display = (
        "usuario",
        "edicao",
        "data_adicao",
    )

    list_filter = ("data_adicao",)

    search_fields = (
        "usuario__email",
        "edicao__livro__titulo",
    )