
from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from usuarios.models import Usuario, Leitor
from livros.models import Edicao, Exemplar
from pedidos.models import Pedido
from emprestimos.models import Emprestimo


EMAIL_PREFIX = "teste.leitor"
SENHA_TESTE = "Teste@Biblioteca2026"


class Command(BaseCommand):
    help = "Cria leitores, pedidos e empréstimos fictícios para testar o painel."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limpar",
            action="store_true",
            help="Apaga pedidos e empréstimos existentes e recria os dados de teste.",
        )

    @transaction.atomic
    def handle(self, *args, **options):

        # -------------------------------------------------
        # 1. Limpeza dos dados anteriores
        # -------------------------------------------------

        if options["limpar"]:
            Emprestimo.objects.all().delete()
            Pedido.objects.all().delete()

            Exemplar.objects.filter(
                status__in=["reservado", "emprestado"]
            ).update(status="disponivel")

            # Remove somente os usuários de teste criados por este comando.
            Usuario.objects.filter(
                email__startswith=EMAIL_PREFIX
            ).delete()

            self.stdout.write(
                self.style.WARNING(
                    "Pedidos e empréstimos anteriores foram apagados."
                )
            )

            self.stdout.write(
                self.style.SUCCESS(
                    "Exemplares reservados e emprestados foram restaurados."
                )
            )

        elif (
            Pedido.objects.exists()
            or Emprestimo.objects.exists()
            or Usuario.objects.filter(
                email__startswith=EMAIL_PREFIX
            ).exists()
        ):
            raise CommandError(
                "Já existem pedidos, empréstimos ou usuários de teste. "
                "Utilize --limpar para recriar os dados."
            )

        # -------------------------------------------------
        # 2. Criação dos leitores fictícios
        # -------------------------------------------------

        leitores = []

        for numero in range(1, 7):
            usuario = Usuario.objects.create_user(
                email=f"{EMAIL_PREFIX}{numero:02d}@teste.local",
                nome=f"Leitor de Teste {numero:02d}",
                password=SENHA_TESTE,
            )

            leitor = Leitor.objects.create(usuario=usuario)
            leitores.append(leitor)

        self.stdout.write(
            self.style.SUCCESS("6 leitores de teste criados.")
        )

        # -------------------------------------------------
        # 3. Localiza uma edição com exatamente um exemplar
        #    disponível para testar a fila de pedidos
        # -------------------------------------------------

        edicoes = Edicao.objects.filter(
            exemplares__status="disponivel"
        ).distinct().order_by("id")

        edicao_fila = None

        for edicao in edicoes:
            quantidade = Exemplar.objects.filter(
                edicao=edicao,
                status="disponivel",
            ).count()

            if quantidade == 1:
                edicao_fila = edicao
                break

        if not edicao_fila:
            raise CommandError(
                "Não foi encontrada uma edição com exatamente "
                "um exemplar disponível para testar a fila."
            )

        exemplar_reservado = Exemplar.objects.get(
            edicao=edicao_fila,
            status="disponivel",
        )

        agora = timezone.now()
        hoje = timezone.localdate()

        # Registra as edições já utilizadas por cada leitor.
        edicoes_por_leitor = {
            leitor.pk: {edicao_fila.pk}
            for leitor in leitores
        }

        # -------------------------------------------------
        # 4. Funções auxiliares
        # -------------------------------------------------

        def criar_pedido(
            leitor,
            edicao,
            status,
            exemplar=None,
            data_resposta=None,
        ):
            pedido = Pedido.objects.create(
                leitor=leitor,
                edicao=edicao,
                exemplar=exemplar,
                status=status,
            )

            if data_resposta:
                Pedido.objects.filter(pk=pedido.pk).update(
                    data_resposta=data_resposta
                )

            return pedido

        def obter_exemplar_disponivel(leitor):
            edicoes_excluidas = edicoes_por_leitor[leitor.pk]

            exemplar = (
                Exemplar.objects.filter(status="disponivel")
                .exclude(edicao_id__in=edicoes_excluidas)
                .select_related("edicao")
                .order_by("id")
                .first()
            )

            if not exemplar:
                raise CommandError(
                    "Não existem exemplares disponíveis suficientes "
                    "para criar todos os empréstimos."
                )

            edicoes_por_leitor[leitor.pk].add(exemplar.edicao_id)

            return exemplar

        def criar_emprestimo(
            leitor,
            dias_para_vencimento,
            dias_desde_retirada,
        ):
            exemplar = obter_exemplar_disponivel(leitor)

            pedido = criar_pedido(
                leitor=leitor,
                edicao=exemplar.edicao,
                status="aprovado",
                exemplar=exemplar,
                data_resposta=agora - timedelta(days=3),
            )

            exemplar.status = "emprestado"
            exemplar.save(update_fields=["status"])

            emprestimo = Emprestimo.objects.create(
                pedido=pedido,
                exemplar=exemplar,
                data_retirada=agora - timedelta(
                    days=dias_desde_retirada
                ),
                data_prevista_devolucao=hoje + timedelta(
                    days=dias_para_vencimento
                ),
            )

            return emprestimo

        # -------------------------------------------------
        # 5. Pedido aprovado aguardando retirada
        # -------------------------------------------------

        pedido_aprovado = criar_pedido(
            leitor=leitores[0],
            edicao=edicao_fila,
            status="aprovado",
            exemplar=exemplar_reservado,
            data_resposta=agora - timedelta(days=2),
        )

        exemplar_reservado.status = "reservado"
        exemplar_reservado.save(update_fields=["status"])

        # -------------------------------------------------
        # 6. Pedido pendente na fila da mesma edição
        # -------------------------------------------------

        pedido_pendente = criar_pedido(
            leitor=leitores[1],
            edicao=edicao_fila,
            status="pendente",
        )

        # -------------------------------------------------
        # 7. Empréstimos em diferentes situações
        # -------------------------------------------------

        # Leitor 1: nenhum empréstimo.

        # Leitor 2: um empréstimo em dia.
        criar_emprestimo(
            leitores[1],
            dias_para_vencimento=11,
            dias_desde_retirada=3,
        )

        # Leitor 3: um empréstimo atrasado.
        criar_emprestimo(
            leitores[2],
            dias_para_vencimento=-16,
            dias_desde_retirada=30,
        )

        # Leitor 4: dois empréstimos atrasados.
        criar_emprestimo(
            leitores[3],
            dias_para_vencimento=-16,
            dias_desde_retirada=30,
        )

        criar_emprestimo(
            leitores[3],
            dias_para_vencimento=-8,
            dias_desde_retirada=22,
        )

        # Leitor 5: um atrasado e outro em dia.
        criar_emprestimo(
            leitores[4],
            dias_para_vencimento=-12,
            dias_desde_retirada=26,
        )

        criar_emprestimo(
            leitores[4],
            dias_para_vencimento=5,
            dias_desde_retirada=3,
        )

        # Leitor 6: dois empréstimos em dia.
        criar_emprestimo(
            leitores[5],
            dias_para_vencimento=8,
            dias_desde_retirada=3,
        )

        criar_emprestimo(
            leitores[5],
            dias_para_vencimento=11,
            dias_desde_retirada=3,
        )

        # -------------------------------------------------
        # 8. Pedido recusado
        # -------------------------------------------------

        edicao_recusada = (
            Edicao.objects.exclude(pk=edicao_fila.pk)
            .exclude(
                pk__in=edicoes_por_leitor[leitores[2].pk]
            )
            .order_by("id")
            .first()
        )

        if not edicao_recusada:
            raise CommandError(
                "Não existem outras edições disponíveis para "
                "criar o pedido recusado."
            )

        pedido_recusado = criar_pedido(
            leitor=leitores[2],
            edicao=edicao_recusada,
            status="recusado",
            data_resposta=agora,
        )

        # -------------------------------------------------
        # 9. Empréstimo devolvido
        # -------------------------------------------------

        exemplar_devolvido = obter_exemplar_disponivel(
            leitores[5]
        )

        pedido_devolvido = criar_pedido(
            leitor=leitores[5],
            edicao=exemplar_devolvido.edicao,
            status="aprovado",
            exemplar=exemplar_devolvido,
            data_resposta=agora - timedelta(days=10),
        )

        Emprestimo.objects.create(
            pedido=pedido_devolvido,
            exemplar=exemplar_devolvido,
            data_retirada=agora - timedelta(days=10),
            data_prevista_devolucao=hoje - timedelta(days=3),
            data_devolucao=agora - timedelta(days=1),
        )

        # O exemplar devolvido permanece disponível.
        exemplar_devolvido.status = "disponivel"
        exemplar_devolvido.save(update_fields=["status"])

        # -------------------------------------------------
        # 10. Resultado
        # -------------------------------------------------

        self.stdout.write(
            self.style.SUCCESS(
                "\nDados de teste criados com sucesso!"
            )
        )

        self.stdout.write("\nLeitores:")

        self.stdout.write("  01 - Sem empréstimos")
        self.stdout.write("  02 - Um empréstimo em dia")
        self.stdout.write("  03 - Um empréstimo atrasado")
        self.stdout.write("  04 - Dois empréstimos atrasados")
        self.stdout.write("  05 - Um atrasado e um em dia")
        self.stdout.write("  06 - Dois empréstimos em dia")

        self.stdout.write("\nPedidos:")
        self.stdout.write("  1 aprovado aguardando retirada")
        self.stdout.write("  1 pendente")
        self.stdout.write("  1 recusado")

        self.stdout.write("\nEmpréstimos:")
        self.stdout.write("  6 leitores com 8 empréstimos ativos")
        self.stdout.write("  1 empréstimo devolvido")

        self.stdout.write("\nAcesso aos usuários de teste:")
        self.stdout.write(f"  E-mail: {EMAIL_PREFIX}01@teste.local até {EMAIL_PREFIX}06@teste.local")
        self.stdout.write(f"  Senha: {SENHA_TESTE}")
