from django.core.management.base import BaseCommand

from notificacoes.services import (
    notificar_devolucoes_proximas,
    notificar_emprestimos_atrasados,
)

class Command(BaseCommand):
    help = "Verifica empréstimos próximos ao vencimento ou atrasados"

    def handle(self, *args, **options):

        proximas = notificar_devolucoes_proximas()

        atrasadas = notificar_emprestimos_atrasados()

        self.stdout.write(
            self.style.SUCCESS(
                f"Verificação concluída!\n"
                f"Notificações de prazo próximo: {proximas}\n"
                f"Notificações de atrazo: {atrasadas}"
            )
        )