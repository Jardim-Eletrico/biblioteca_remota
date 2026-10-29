from django.conf import settings
from django.core.mail import send_mail
from django.dispatch import receiver

from django_rest_passwordreset.signals import (reset_password_token_created,)

@receiver(reset_password_token_created)
def enviar_token_recuperacao(sender, instance, reset_password_token, **kwargs,):
    usuario = reset_password_token.user
    token = reset_password_token.key

    send_mail(
        
    )