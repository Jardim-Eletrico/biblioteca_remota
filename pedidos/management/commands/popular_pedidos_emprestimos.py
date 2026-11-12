
from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from usuarios.models import Leitor
from livros.models import Edicao, Exemplar
from pedidos.models import Pedido
from emprestimos.models import Emprestimo


class Command(BaseCommand):
    help = "Cria pedidos e empréstimos fictícios para testar o painel do bibliotecário."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limpar",
            action="store_true",
            help="Apaga pedidos e empréstimos existentes antes de repovoar.",
        )

    @transaction.atomic
    def handle(self, *args, **options):

        # Limpa somente os pedidos e empréstimos de teste.
        if options["limpar"]:
            Emprestimo.objects.all().delete()
            Pedido.objects.all().delete()

            Exemplar.objects.filter(
                status__in=["reservado", "emprestado"]
            ).update(status="disponivel")

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

        # Não misturar os dados de teste com registros existentes.
        elif Pedido.objects.exists() or Emprestimo.objects.exists():
            raise CommandError(
                "Já existem pedidos ou empréstimos no banco. "
                "Utilize --limpar para apagá-los e repovoar."
            )

        leitores = list(
            Leitor.objects.select_related("usuario").order_by("id")[:6]
        )

        if len(leitores) < 6:
            raise CommandError(
                "São necessários pelo menos 6 leitores cadastrados."
            )

        agora = timezone.now()
        hoje = timezone.localdate()

        # Localiza uma edição que tenha exatamente um exemplar disponível.
        edicao_fila = (
            Edicao.objects.filter(exemplares__status="disponivel")
            .order_by("id")
            .distinct()
        )

        edicao_unica = None

        for edicao in edicao_fila:
            disponiveis = Exemplar.objects.filter(
                edicao=edicao,
                status="disponivel"
            )

            if disponiveis.count() == 1:
                edicao_unica = edicao
                break

        if not edicao_unica:
            raise CommandError(
                "Não foi encontrada uma edição com exatamente um "
                "exemplar disponível para testar a fila de pedidos."
            )

        def criar_pedido(leitor, edicao, status, exemplar=None):
            return Pedido.objects.create(
                leitor=leitor,
                edicao=edicao,
                exemplar=exemplar,
                status=status,
            )

        # -------------------------------------------------
        # 1. Pedido aprovado aguardando retirada
        # -------------------------------------------------

        exemplar_reservado = Exemplar.objects.get(
            edicao=edicao_unica,
            status="disponivel"
        )

        pedido_aprovado = criar_pedido(
            leitores[0],
            edicao_unica,
            "aprovado",
            exemplar_reservado,
        )

        exemplar_reservado.status = "reservado"
        exemplar_reservado.save(update_fields=["status"])

        # -------------------------------------------------
        # 2. Pedido pendente na fila da mesma edição
        # -------------------------------------------------

        pedido_pendente = criar_pedido(
            leitores[1],
            edicao_unica,
            "pendente",
        )

        # -------------------------------------------------
        # 3. Pedido recusado
        # -------------------------------------------------

        edicao_recusado = (
            Edicao.objects.exclude(pk=edicao_unica.pk)
            .order_by("id")
            .first()
        )

        if not edicao_recusado:
            raise CommandError("Não existem outras edições cadastradas.")

        pedido_recusado = criar_pedido(
            leitores[2],
            edicao_recusado,
            "recusado",
        )

        Pedido.objects.filter(pk=pedido_recusado.pk).update(
            data_resposta=agora
        )

        # -------------------------------------------------
        # Função auxiliar para obter exemplares disponíveis
        # -------------------------------------------------

        def obter_exemplar_disponivel(edicoes_excluidas):
            return (
                Exemplar.objects.filter(status="disponivel")
                .exclude(edicao_id__in=edicoes_excluidas)
                .select_related("edicao")
                .order_by("id")
                .first()
            )

        # -------------------------------------------------
        # 4. Empréstimo em andamento
        # -------------------------------------------------

        exemplar_ativo = obter_exemplar_disponivel(
            [edicao_unica.pk, edicao_recusado.pk]
        )

        if not exemplar_ativo:
            raise CommandError("Não há exemplares disponíveis suficientes.")

        pedido_ativo = criar_pedido(
            leitores[3],
            exemplar_ativo.edicao,
            "aprovado",
            exemplar_ativo,
        )

        exemplar_ativo.status = "emprestado"
        exemplar_ativo.save(update_fields=["status"])

        emprestimo_ativo = Emprestimo.objects.create(
            pedido=pedido_ativo,
            exemplar=exemplar_ativo,
            data_retirada=agora - timedelta(days=3),
            data_prevista_devolucao=hoje + timedelta(days=11),
        )

        # -------------------------------------------------
        # 5. Empréstimo atrasado
        # -------------------------------------------------

        exemplar_atrasado = obter_exemplar_disponivel(
            [
                edicao_unica.pk,
                edicao_recusado.pk,
                exemplar_ativo.edicao_id,
            ]
        )

        if not exemplar_atrasado:
            raise CommandError("Não há exemplares suficientes para o atraso.")

        pedido_atrasado = criar_pedido(
            leitores[4],
            exemplar_atrasado.edicao,
            "aprovado",
            exemplar_atrasado,
        )

        exemplar_atrasado.status = "emprestado"
        exemplar_atrasado.save(update_fields=["status"])

        emprestimo_atrasado = Emprestimo.objects.create(
            pedido=pedido_atrasado,
            exemplar=exemplar_atrasado,
            data_retirada=agora - timedelta(days=30),
            data_prevista_devolucao=hoje - timedelta(days=16),
        )

        # -------------------------------------------------
        # 6. Empréstimo devolvido
        # -------------------------------------------------

        exemplar_devolvido = obter_exemplar_disponivel(
            [
                edicao_unica.pk,
                edicao_recusado.pk,
                exemplar_ativo.edicao_id,
                exemplar_atrasado.edicao_id,
            ]
        )

        if not exemplar_devolvido:
            raise CommandError("Não há exemplares suficientes para devolução.")

        pedido_devolvido = criar_pedido(
            leitores[5],
            exemplar_devolvido.edicao,
            "aprovado",
            exemplar_devolvido,
        )

        exemplar_devolvido.status = "disponivel"
        exemplar_devolvido.save(update_fields=["status"])

        emprestimo_devolvido = Emprestimo.objects.create(
            pedido=pedido_devolvido,
            exemplar=exemplar_devolvido,
            data_retirada=agora - timedelta(days=10),
            data_prevista_devolucao=hoje - timedelta(days=3),
            data_devolucao=agora - timedelta(days=5),
        )

        # -------------------------------------------------
        # Ajusta datas das respostas dos pedidos
        # -------------------------------------------------

        Pedido.objects.filter(pk=pedido_aprovado.pk).update(
            data_resposta=agora - timedelta(days=2)
        )

        Pedido.objects.filter(pk=pedido_ativo.pk).update(
            data_resposta=agora - timedelta(days=3)
        )

        Pedido.objects.filter(pk=pedido_atrasado.pk).update(
            data_resposta=agora - timedelta(days=30)
        )

        Pedido.objects.filter(pk=pedido_devolvido.pk).update(
            data_resposta=agora - timedelta(days=10)
        )

        # -------------------------------------------------
        # Resultado
        # -------------------------------------------------

        self.stdout.write(
            self.style.SUCCESS("\nDados de teste criados com sucesso!")
        )

        self.stdout.write("Pedidos:")
        self.stdout.write("  1 aprovado aguardando retirada")
        self.stdout.write("  1 pendente")
        self.stdout.write("  1 recusado")

        self.stdout.write("Empréstimos:")
        self.stdout.write("  1 em andamento")
        self.stdout.write("  1 atrasado")
        self.stdout.write("  1 devolvido")
