from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.dispatch import receiver

from django_rest_passwordreset.signals import reset_password_token_created

print("ARQUIVO SIGNALS.PY FOI CARREGADO!")


@receiver(reset_password_token_created)
def enviar_token_recuperacao(sender, instance, reset_password_token, **kwargs):
    print("SINAL DE RECUPERAÇÃO EXECUTADO!")

    usuario = reset_password_token.user
    token = reset_password_token.key

    print(f"Usuário encontrado: {usuario.email}")

    reset_url = (
        f"http://localhost:5173/reset-password/?token={token}"
    )

    contexto = {
        "usuario": usuario,
        "reset_url": reset_url,
    }

    print("Tentando carregar o template HTML...")

    html = render_to_string(
        "emails/recuperacao_senha.html",
        contexto,
    )

    print("Template HTML carregado!")

    texto = (
        "Biblioteca Remota\n\n"
        "Recebemos uma solicitação de recuperação de senha.\n"
        f"Acesse: {reset_url}\n"
    )

    email = EmailMultiAlternatives(
        subject="Recuperação de senha - Biblioteca Remota",
        body=texto,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[usuario.email],
    )

    email.attach_alternative(html, "text/html")

    print("Tentando enviar o e-mail...")

    email.send()

    print("E-mail processado!")

