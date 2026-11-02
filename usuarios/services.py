import secrets
from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import check_password

from django.db import transaction

from .models import CodigoRecuperacao

def gerar_codigo():
    return f"{secrets.randbelow(1000000):06d}"

def solicitar_recuperacao(usuario):
    codigo = gerar_codigo()

    agora = timezone.now()

    CodigoRecuperacao.objects.create(
        usuario = usuario,
        codigo_hash=make_password(codigo),
        expira_em=agora + timedelta(minutes=10)
    )

    send_mail(
        subject="Recuperacao de Senha - Biblioteca Remota",
        message=(
            f"Seu código de recuperacao é: {codigo}\n\n"
            "Este código expira em 10 minutos"
        ),

        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[usuario.email],
    )

def validar_codigo(usuario, codigo):
    solicitcao = (
        CodigoRecuperacao.objects.filter(usuario = usuario, utilizado = False).order_by("-criado_em").first()
    )

    if solicitcao is None:
        return False

    if solicitcao.esta_expirado():
        return False

    if not check_password(codigo, solicitcao.codigo_hash):
        return False

    return True

@transaction.atomic
def redefinir_senha(usuario, codigo, nova_senha):
    solicitacao = (
        CodigoRecuperacao.objects
        .filter(
            usuario=usuario,
            utilizado=False
        )
        .order_by("-criado_em")
        .first()
    )

    if solicitacao is None:
        return False

    if solicitacao.esta_expirado():
        return False

    if not check_password(codigo, solicitacao.codigo_hash):
        return False

    usuario.set_password(nova_senha)
    usuario.save(update_fields=["password"])

    solicitacao.utilizado = True
    solicitacao.save(update_fields=["utilizado"])

    return True