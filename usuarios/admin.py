from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Leitor, Bibliotecario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ("Dados adicionais", {
            "fields": ("nome", "cpf"),
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "password1",
                "password2",
                "nome",
                "cpf",
            ),
        }),
    )

# Register your models here.
admin.site.register(Leitor)
admin.site.register(Bibliotecario)
