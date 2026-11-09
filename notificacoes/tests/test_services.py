from datetime import date

from django.test import TestCase

from datetime import date, timedelta

from django.utils import timezone

from usuarios.models import Usuario, Leitor
from livros.models import Livro, Edicao, Exemplar
from pedidos.models import Pedido
from emprestimos.models import Emprestimo
from notificacoes.models import Notificacao
from desejos.models import ListaDesejo

from notificacoes.services import (
    notificar_emprestimo_efetivado,
    notificar_aprovacao_pedido,
    notificar_usuarios_lista_desejos,
    notificar_cancelamento_pedido,
    notificar_devolucoes_proximas,
    notificar_emprestimos_atrasados,
    )


class NotificarEmprestimoEfetivadoTest(TestCase):

    def setUp(self):
        # Cria o usuário e seu perfil de leitor.
        self.usuario = Usuario.objects.create_user(
            email="leitor@teste.com",
            password="senha123",
            nome="Leitor de Teste",
        )

        self.leitor = Leitor.objects.create(
            usuario=self.usuario
        )

        # Cria o livro e sua edição.
        self.livro = Livro.objects.create(
            titulo="Livro de Teste",
            autor="Autor de Teste",
            ano_original=2020,
        )

        self.edicao = Edicao.objects.create(
            livro=self.livro,
            ano_publicacao=2022,
            editora="Editora de Teste",
        )

        # Cria um exemplar.
        self.exemplar = Exemplar.objects.create(
            edicao=self.edicao,
            status="emprestado",
        )

        # Cria um pedido aprovado.
        self.pedido = Pedido.objects.create(
            leitor=self.leitor,
            edicao=self.edicao,
            exemplar=self.exemplar,
            status="aprovado",
        )

        # Cria o empréstimo.
        self.emprestimo = Emprestimo.objects.create(
            pedido=self.pedido,
            exemplar=self.exemplar,
            data_prevista_devolucao=date(2026, 11, 21),
        )

    def test_criar_notificacao_de_emprestimo(self):

        notificar_emprestimo_efetivado(self.emprestimo)

        notificacao = Notificacao.objects.get(
            usuario=self.usuario
        )

        self.assertEqual(
            notificacao.titulo,
            "Empréstimo realizado!",
        )

        self.assertIn(
            "Livro de Teste",
            notificacao.mensagem,
        )

        self.assertIn(
            "21/11/2026",
            notificacao.mensagem,
        )

        self.assertFalse(notificacao.lida)


    def test_criar_notificacao_de_aprovacao(self):

        notificar_aprovacao_pedido(self.pedido)

        notificacao = Notificacao.objects.get(
            usuario=self.usuario
        )

        self.assertEqual(
            notificacao.titulo,
            "Reserva aprovada!",
        )

        self.assertEqual(
            notificacao.mensagem,
            'Sua reserva do livro "Livro de Teste" foi aprovada. '
            "Compareça à biblioteca para retirar o exemplar."
        )

        self.assertFalse(notificacao.lida)

    def test_notificar_usuarios_lista_desejos(self):

        # Cria um segundo usuário.
        outro_usuario = Usuario.objects.create_user(
            email="outro@teste.com",
            password="senha123",
            nome="Outro Leitor",
        )

        # Primeiro usuário estava aguardando disponibilidade.
        desejo1 = ListaDesejo.objects.create(
            usuario=self.usuario,
            edicao=self.edicao,
            aguardando_disponibilidade=True,
        )

        # Segundo usuário não estava aguardando.
        desejo2 = ListaDesejo.objects.create(
            usuario=outro_usuario,
            edicao=self.edicao,
            aguardando_disponibilidade=False,
        )

        # Executa a notificação.
        notificar_usuarios_lista_desejos(self.edicao)

        # Verifica que somente o primeiro usuário recebeu.
        notificacoes = Notificacao.objects.filter(
            titulo="Livro disponível!"
        )

        self.assertEqual(notificacoes.count(), 1)

        self.assertTrue(
            notificacoes.filter(usuario=self.usuario).exists()
        )

        self.assertFalse(
            notificacoes.filter(usuario=outro_usuario).exists()
        )

        # Verifica que os dois registros não estão mais aguardando.
        desejo1.refresh_from_db()
        desejo2.refresh_from_db()

        self.assertFalse(desejo1.aguardando_disponibilidade)
        self.assertFalse(desejo2.aguardando_disponibilidade)
        
    def test_criar_notificacao_de_cancelamento(self):

        notificar_cancelamento_pedido(self.pedido)

        notificacao = Notificacao.objects.get(
            usuario=self.usuario
        )

        self.assertEqual(
            notificacao.titulo,
            "Pedido cancelado!",
        )

        self.assertEqual(
            notificacao.mensagem,
            'Seu pedido do livro "Livro de Teste" foi cancelado.'
        )

        self.assertFalse(notificacao.lida)

    def test_notificar_devolucao_proxima(self):
        hoje = timezone.localdate()

        self.emprestimo.data_prevista_devolucao = (
            hoje + timedelta(days=2)
        )
        self.emprestimo.save(
            update_fields=["data_prevista_devolucao"]
        )

        total = notificar_devolucoes_proximas()

        self.assertEqual(total, 1)

        notificacao = Notificacao.objects.get(
            usuario=self.usuario,
            emprestimo=self.emprestimo
        )

        self.assertEqual(
            notificacao.titulo,
            "AVISO DE PRAZO DE DEVOLUÇÃO"
        )

        self.assertIn(
            "Livro de Teste",
            notificacao.mensagem
        )

    def test_nao_duplicar_aviso_de_devolucao_proxima(self):
        hoje = timezone.localdate()

        self.emprestimo.data_prevista_devolucao = (
            hoje + timedelta(days=2)
        )
        self.emprestimo.save(
            update_fields=["data_prevista_devolucao"]
        )

        primeira_execucao = notificar_devolucoes_proximas()
        segunda_execucao = notificar_devolucoes_proximas()

        self.assertEqual(primeira_execucao, 1)
        self.assertEqual(segunda_execucao, 0)

        self.assertEqual(
            Notificacao.objects.filter(
                emprestimo=self.emprestimo,
                titulo="AVISO DE PRAZO DE DEVOLUÇÃO"
            ).count(),
            1
        )

    def test_notificar_emprestimo_atrasado(self):
        hoje = timezone.localdate()

        self.emprestimo.data_prevista_devolucao = (
            hoje - timedelta(days=1)
        )
        self.emprestimo.save(
            update_fields=["data_prevista_devolucao"]
        )

        total = notificar_emprestimos_atrasados()

        self.assertEqual(total, 1)

        notificacao = Notificacao.objects.get(
            usuario=self.usuario,
            emprestimo=self.emprestimo
        )

        self.assertEqual(
            notificacao.titulo,
            "Empréstimo em atraso!"
        )

        self.assertIn(
            "Livro de Teste",
            notificacao.mensagem
        )

        # Executa novamente para verificar duplicidade.
        segunda_execucao = notificar_emprestimos_atrasados()

        self.assertEqual(segunda_execucao, 0)

        self.assertEqual(
            Notificacao.objects.filter(
                emprestimo=self.emprestimo,
                titulo="Empréstimo em atraso!"
            ).count(),
            1
        )

    def test_nao_notificar_emprestimo_devolvido(self):
        hoje = timezone.localdate()

        self.emprestimo.data_prevista_devolucao = (
            hoje - timedelta(days=1)
        )
        self.emprestimo.data_devolucao = timezone.now()

        self.emprestimo.save(
            update_fields=[
                "data_prevista_devolucao",
                "data_devolucao"
            ]
        )

        total = notificar_emprestimos_atrasados()

        self.assertEqual(total, 0)

        self.assertFalse(
            Notificacao.objects.filter(
                emprestimo=self.emprestimo,
                titulo="Empréstimo em atraso!"
            ).exists()
        )