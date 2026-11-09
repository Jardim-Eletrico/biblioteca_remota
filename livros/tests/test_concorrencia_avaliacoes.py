
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

from django.test import TransactionTestCase, skipUnlessDBFeature
from django.contrib.auth import get_user_model
from django.db import close_old_connections, connections
from django.utils import timezone

from rest_framework.exceptions import ValidationError

from usuarios.models import Leitor
from livros.models import Livro, Edicao, Exemplar, Avaliacao
from pedidos.models import Pedido
from emprestimos.models import Emprestimo

from livros.services import avaliar_livro


Usuario = get_user_model()


class AvaliacaoConcorrenciaTest(TransactionTestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            email="concorrencia@teste.com",
            password="SenhaTeste123!",
            nome="Leitor Concorrencia"
        )

        self.leitor = Leitor.objects.create(
            usuario=self.usuario
        )

        self.livro = Livro.objects.create(
            titulo="Livro Concorrencia",
            autor="Autor Teste",
            ano_original=2020
        )

        self.edicao = Edicao.objects.create(
            livro=self.livro,
            ano_publicacao=2020,
            editora="Editora Teste"
        )

        self.exemplar = Exemplar.objects.create(
            edicao=self.edicao
        )

        self.pedido = Pedido.objects.create(
            leitor=self.leitor,
            edicao=self.edicao,
            exemplar=self.exemplar,
            status="aprovado"
        )

        # O leitor já devolveu o livro
        Emprestimo.objects.create(
            pedido=self.pedido,
            exemplar=self.exemplar,
            data_devolucao=timezone.now()
        )

    @skipUnlessDBFeature("has_select_for_update")
    def test_duas_avaliacoes_simultaneas(self):

        barreira = Barrier(2)

        leitor_id = self.leitor.pk
        livro_id = self.livro.pk

        def executar_avaliacao(nota):

            # Cada thread utiliza sua própria conexão
            close_old_connections()

            try:
                leitor = Leitor.objects.get(pk=leitor_id)
                livro = Livro.objects.get(pk=livro_id)

                # Faz as duas requisições começarem juntas
                barreira.wait(timeout=15)

                try:
                    avaliacao = avaliar_livro(
                        leitor=leitor,
                        livro=livro,
                        nota=nota
                    )

                    return ("sucesso", avaliacao.pk)

                except ValidationError as erro:
                    return ("bloqueada", str(erro.detail))

            finally:
                connections.close_all()

        with ThreadPoolExecutor(max_workers=2) as executor:

            tarefa1 = executor.submit(executar_avaliacao, 4)
            tarefa2 = executor.submit(executar_avaliacao, 5)

            resultado1 = tarefa1.result(timeout=30)
            resultado2 = tarefa2.result(timeout=30)

        resultados = [resultado1, resultado2]

        # Apenas uma avaliação deve ser aceita
        sucessos = [
            resultado
            for resultado in resultados
            if resultado[0] == "sucesso"
        ]

        bloqueios = [
            resultado
            for resultado in resultados
            if resultado[0] == "bloqueada"
        ]

        self.assertEqual(len(sucessos), 1)
        self.assertEqual(len(bloqueios), 1)

        # Deve existir somente uma avaliação no banco
        self.assertEqual(
            Avaliacao.objects.filter(
                leitor=self.leitor,
                livro=self.livro
            ).count(),
            1
        )
