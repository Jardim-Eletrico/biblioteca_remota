
from datetime import timedelta

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.utils import timezone

from rest_framework.exceptions import ValidationError

from usuarios.models import Leitor
from livros.models import Livro, Edicao, Exemplar, Avaliacao
from pedidos.models import Pedido
from emprestimos.models import Emprestimo

from livros.services import avaliar_livro


Usuario = get_user_model()


class AvaliarLivroTest(TestCase):

    def setUp(self):
        # Criar usuário e leitor
        self.usuario = Usuario.objects.create_user(
            email="leitor@teste.com",
            password="SenhaTeste123!",
            nome="Leitor de Teste"
        )

        self.leitor = Leitor.objects.create(
            usuario=self.usuario
        )

        # Criar livro
        self.livro = Livro.objects.create(
            titulo="Livro de Teste",
            autor="Autor de Teste",
            ano_original=2020
        )

        # Criar edição
        self.edicao = Edicao.objects.create(
            livro=self.livro,
            ano_publicacao=2020,
            editora="Editora de Teste"
        )

    # Criar empréstimo para os testes
    def criar_emprestimo(self, devolvido=True):

        exemplar = Exemplar.objects.create(
            edicao=self.edicao
        )

        pedido = Pedido.objects.create(
            leitor=self.leitor,
            edicao=self.edicao,
            exemplar=exemplar,
            status="aprovado"
        )

        data_devolucao = (
            timezone.now() if devolvido else None
        )

        return Emprestimo.objects.create(
            pedido=pedido,
            exemplar=exemplar,
            data_devolucao=data_devolucao
        )

    # 1. Primeira avaliação
    def test_criar_primeira_avaliacao(self):

        self.criar_emprestimo()

        avaliacao = avaliar_livro(
            leitor=self.leitor,
            livro=self.livro,
            nota=4
        )

        self.assertEqual(avaliacao.nota, 4)

        self.assertEqual(
            Avaliacao.objects.filter(
                leitor=self.leitor,
                livro=self.livro
            ).count(),
            1
        )

    # 2. Impedir nota inválida
    def test_impedir_notas_invalidas(self):

        valores_invalidos = [
            0,
            6,
            -1,
            1.5,
            True,
            "4",
            None
        ]

        for nota in valores_invalidos:

            with self.subTest(nota=nota):

                with self.assertRaises(ValidationError):
                    avaliar_livro(
                        leitor=self.leitor,
                        livro=self.livro,
                        nota=nota
                    )

    # 3. Impedir avaliação sem devolução
    def test_impedir_avaliacao_sem_devolucao(self):

        with self.assertRaises(ValidationError):
            avaliar_livro(
                leitor=self.leitor,
                livro=self.livro,
                nota=5
            )

        self.assertEqual(
            Avaliacao.objects.count(),
            0
        )

    # 4. Impedir avaliação com empréstimo ativo
    def test_impedir_avaliacao_com_emprestimo_ativo(self):

        self.criar_emprestimo()

        self.criar_emprestimo(devolvido=False)

        with self.assertRaises(ValidationError):
            avaliar_livro(
                leitor=self.leitor,
                livro=self.livro,
                nota=5
            )

        self.assertEqual(
            Avaliacao.objects.count(),
            0
        )

    # 5. Impedir nova avaliação antes de sete dias
    def test_impedir_alteracao_antes_de_sete_dias(self):

        self.criar_emprestimo()

        avaliacao = Avaliacao.objects.create(
            leitor=self.leitor,
            livro=self.livro,
            nota=3
        )

        with self.assertRaises(ValidationError):
            avaliar_livro(
                leitor=self.leitor,
                livro=self.livro,
                nota=5
            )

        avaliacao.refresh_from_db()

        self.assertEqual(avaliacao.nota, 3)

    # 6. Permitir alteração após sete dias
    def test_permitir_alteracao_apos_sete_dias(self):

        self.criar_emprestimo()

        avaliacao = Avaliacao.objects.create(
            leitor=self.leitor,
            livro=self.livro,
            nota=3
        )

        # Simular avaliação feita há oito dias
        Avaliacao.objects.filter(
            pk=avaliacao.pk
        ).update(
            data_avaliacao=timezone.now() - timedelta(days=8)
        )

        avaliacao_atualizada = avaliar_livro(
            leitor=self.leitor,
            livro=self.livro,
            nota=5
        )

        self.assertEqual(
            avaliacao_atualizada.pk,
            avaliacao.pk
        )

        self.assertEqual(
            avaliacao_atualizada.nota,
            5
        )

        self.assertEqual(
            Avaliacao.objects.filter(
                leitor=self.leitor,
                livro=self.livro
            ).count(),
            1
        )

    # 7. Impedir avaliações duplicadas diretamente no banco
    def test_restricao_de_avaliacao_unica(self):

        Avaliacao.objects.create(
            leitor=self.leitor,
            livro=self.livro,
            nota=4
        )

        with self.assertRaises(IntegrityError):

            with transaction.atomic():
                Avaliacao.objects.create(
                    leitor=self.leitor,
                    livro=self.livro,
                    nota=5
                )
