from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from django.utils import timezone

from drf_spectacular.utils import extend_schema
from pedidos.models import Pedido

from .models import Emprestimo, CodigoConfirmacao
from .confirmacao_service import gerar_e_enviar_codigo

from .emprestimo_serializer import (
    EmprestimoSerializer,
    EfetivarEmprestimoSerializer,
)
from .services import efetivar_emprestimo, devolver_emprestimo
from api.permissions import *


# Create your views here.
class EmprestimoListView(ListAPIView):
    queryset = Emprestimo.objects.select_related(
        "pedido__leitor__usuario",
        "pedido__edicao__livro",
        "exemplar",
    ).all().order_by("-data_retirada")

    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

class EfetivarEmprestimo(APIView):
    serializer_class = EfetivarEmprestimoSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

    @extend_schema(
            request=EfetivarEmprestimoSerializer
    )
    def post(self, request, pedido_id):
        pedido = get_object_or_404(
            Pedido,
            pk = pedido_id,
        )

        serializer = EfetivarEmprestimoSerializer(
            data = request.data,
        )
        serializer.is_valid(raise_exception=True)

        dados = serializer.validated_data

        emprestimo = efetivar_emprestimo(
            pedido_id=pedido.pk,
            exemplar_id=dados['exemplar'].pk,
            codigo_confirmacao=dados["codigo_confirmacao"],
            data_prevista_devolucao=dados.get(
                'data_prevista_devolucao'
            ),
        )

        return Response(
            {
                "mensagem": "Empréstimo efetivado com sucesso",
                "emprestimo": {
                    "id": emprestimo.pk,
                    "pedido_id": emprestimo.pedido_id,
                    "exemplar_id": emprestimo.exemplar_id,
                    "tombo": emprestimo.exemplar.tombo,
                    "data_retirada": emprestimo.data_retirada,
                    "data_prevista_devolucao": (
                        emprestimo.data_prevista_devolucao
                    ),
                    "data_devolucao": emprestimo.data_devolucao
                },
            },
            status=status.HTTP_201_CREATED
        )


class ReenviarCodigoConfirmacao(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]

    @extend_schema(
        summary="Reenviar código de confirmação do empréstimo",
        description=(
            "Gera e envia um novo código quando o anterior "
            "expirou ou atingiu o limite de tentativas."
        ),
        responses={
            200: {"description": "Novo código enviado com sucesso."},
            400: {"description": "Pedido não pode receber novo código."},
            404: {"description": "Pedido não encontrado."},
        },
    )
    def post(self, request, pedido_id):
        pedido = get_object_or_404(
            Pedido,
            pk=pedido_id,
        )

        if pedido.status != "aprovado":
            return Response(
                {"erro": "O pedido precisa estar aprovado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hasattr(pedido, "emprestimo"):
            return Response(
                {"erro": "Este pedido já possui um empréstimo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        codigo_obj = CodigoConfirmacao.objects.filter(
            pedido=pedido
        ).first()

        if codigo_obj is None:
            return Response(
                {"erro": "Este pedido ainda não possui código de confirmação."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if codigo_obj.utilizado:
            return Response(
                {"erro": "Este código já foi utilizado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        codigo_expirado = codigo_obj.data_expiracao <= timezone.now()
        limite_atingido = codigo_obj.tentativas >= 5

        if not codigo_expirado and not limite_atingido:
            return Response(
                {
                    "erro": (
                        "O código atual ainda está válido. "
                        "Aguarde sua expiração ou atingir o limite de tentativas."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        gerar_e_enviar_codigo(pedido)

        return Response(
            {"mensagem": "Um novo código foi enviado ao e-mail do leitor."},
            status=status.HTTP_200_OK,
        )

class DevolverEmprestimo(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def post(self, request, emprestimo_id):
        emprestimo = devolver_emprestimo(emprestimo_id)
        return Response(
            {
                "mensagem": "Empréstimo devolvido com sucesso.",
                "emprestimo_id": emprestimo.pk,
                "data_devolucao": emprestimo.data_devolucao,
                "exemplar_id": emprestimo.exemplar_id,
                "status_exemplar": "disponivel",
            },
            status=status.HTTP_200_OK,
        )