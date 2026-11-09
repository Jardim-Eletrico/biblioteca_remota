from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from drf_spectacular.utils import extend_schema
from pedidos.models import Pedido

from .models import Emprestimo
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