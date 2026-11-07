from datetime import date

from django.test import TestCase

from usuarios.models import Usuario, Leitor
from livros.models import Livro, Edicao, Exemplar
from pedidos.models import Pedido
from emprestimos.models import Emprestimo
from notificacoes.models import Notificacao
from desejos.models import ListaDesejo

from notificacoes.services import (notificar_emprestimo_efetivado, notificar_aprovacao_pedido, notificar_usuarios_lista_desejos)


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
            "Reserva Aprovada",
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

        # Adiciona os dois usuários à lista de desejos.
        ListaDesejo.objects.create(
            usuario=self.usuario,
            edicao=self.edicao,
        )

        ListaDesejo.objects.create(
            usuario=outro_usuario,
            edicao=self.edicao,
        )

        # Executa a notificação.
        notificar_usuarios_lista_desejos(self.edicao)

        # Verifica se os dois receberam a notificação.
        notificacoes = Notificacao.objects.filter(
            titulo="Livro disponível!"
        )

        self.assertEqual(notificacoes.count(), 2)

        self.assertTrue(
            notificacoes.filter(usuario=self.usuario).exists()
        )

        self.assertTrue(
            notificacoes.filter(usuario=outro_usuario).exists()
        )