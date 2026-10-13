
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario, Leitor, Bibliotecario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario

    list_display = ("id", "nome", "email", "is_staff")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Informações pessoais", {"fields": ("nome",)}),
        ("Permissões", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("nome", "email", "password1", "password2"),
        }),
    )

    ordering = ("email",)
    search_fields = ("nome", "email")


@admin.register(Leitor)
class LeitorAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario")
    search_fields = ("usuario__nome", "usuario__email")


@admin.register(Bibliotecario)
class BibliotecarioAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "matricula")
    search_fields = ("usuario__nome", "usuario__email", "matricula")
