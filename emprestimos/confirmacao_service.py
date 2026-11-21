import secrets

from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone

from emprestimos.models import CodigoConfirmacao


def gerar_e_enviar_codigo(reserva):

    leitor = reserva.leitor
    usuario = leitor.usuario
    email = usuario.email
    
    if not email:
        raise ValueError("E-mail inválido")

    codigo = f"{secrets.randbelow(1_000_000):06d}"

    data_expiracao = timezone.now() + timedelta(days=1)

    codigo_obj = CodigoConfirmacao.objects.filter(
        reserva=reserva
    ).first()

    if codigo_obj:
        if (
            not codigo_obj.utilizado
            and codigo_obj.data_expiracao > timezone.now()
            and codigo_obj.tentativas < 5
        ):
            return

        codigo_obj.codigo_hash = make_password(codigo)
        codigo_obj.data_expiracao = data_expiracao
        codigo_obj.utilizado = False
        codigo_obj.tentativas = 0
        codigo_obj.save()

    else:
        CodigoConfirmacao.objects.create(
            reserva=reserva,
            codigo_hash=make_password(codigo),
            data_expiracao=data_expiracao,
            utilizado=False,
            tentativas=0,
        )

    send_mail(
        subject="Código de confirmação da reserva",
        message=(
            f"Olá, {usuario.nome}!\n\n"
            f"Sua reserva foi criada e possui pedidos aprovados.\n\n"
            f"Seu código de confirmação é: {codigo}\n\n"
            "Apresente esse código ao bibliotecário no momento "
            "da retirada dos livros.\n\n"
            "O código é válido por 24 horas (1 dia)."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )