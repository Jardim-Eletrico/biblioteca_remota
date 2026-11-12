import secrets

from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone

from emprestimos.models import CodigoConfirmacao


def gerar_e_enviar_codigo(pedido):
    codigo = f"{secrets.randbelow(1_000_000):06d}"

    data_expiracao = timezone.now() + timedelta(days=1)

    CodigoConfirmacao.objects.update_or_create(
        pedido=pedido,
        defaults={
            "codigo_hash": make_password(codigo),
            "data_expiracao": data_expiracao,
            "utilizado": False,
            "tentativas": 0,
        },
    )

    email = pedido.leitor.usuario.email

    if not email:
        raise ValueError(
            "E-mail inválido"
        )
    
    send_mail(
        subject="Código de confirmação do empréstimo",
        message=(
            f"Olá, {pedido.leitor.usuario.nome}!\n\n"
            f"Seu pedido foi aprovado.\n\n"
            f"Seu código de confirmação é: {codigo}\n\n"
            "Apresente esse código ao bibliotecário no momento "
            "da retirada do livro.\n\n"
            "O código é válido por 24 horas (1 dia)"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )