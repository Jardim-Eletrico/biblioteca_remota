from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from pedidos.models import Pedido
from .pedidos_serializer import (
    PedidoSerializer,
    PedidoResponderSerializer,
)

from .services import (criar_pedido, cancelar_pedido)
from api.permissions import IsBibliotecario

class PedidoCreateView(generics.CreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = request.user

        try:
            leitor = usuario.leitor
        except ObjectDoesNotExist:
            raise PermissionDenied(
                "Sua conta não possui um perfil de leitor."
            )

        pedido = criar_pedido(
            leitor=leitor,
            edicao_id=serializer.validated_data["edicao"].id
        )

        resposta = self.get_serializer(pedido)

        headers = self.get_success_headers(resposta.data)

        return Response(
            resposta.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class PedidoResponderView(APIView):
    serializer_class = PedidoResponderSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, pk=pedido_id)

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        novo_status = serializer.validated_data["status"]

        if pedido.status != "pendente":
            return Response(
                {"erro": "Somente pedidos pendentes podem ser respondidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if novo_status == "aprovado":
            return Response(
                {
                    "erro": (
                        "A aprovação é automática quando um exemplar "
                        "está disponível."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        pedido.status = "recusado"
        pedido.data_resposta = timezone.now()

        pedido.save(update_fields=[
            "status",
            "data_resposta"
        ])

        return Response(
            {
                "mensagem": "Pedido recusado com sucesso.",
                "pedido_id": pedido.pk,
                "status": pedido.status,
                "data_resposta": pedido.data_resposta,
            },
            status=status.HTTP_200_OK,
        )


class MeusPedidosAtivosView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        usuario = self.request.user

        try:
            leitor = usuario.leitor
        except ObjectDoesNotExist:
            raise PermissionDenied(
                "Sua conta não possui um perfil de leitor."
            )

        return Pedido.objects.filter(
            leitor=leitor
        ).filter(
            Q(status="pendente") |
            Q(
                status="aprovado",
                emprestimo__isnull=True
            ) |
            Q(
                status="aprovado",
                emprestimo__data_devolucao__isnull=True
            )
        ).select_related(
            "edicao",
            "edicao__livro",
            "exemplar"
        ).order_by("-data_pedido")


class PedidoCancelarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pedido_id):

        pedido = get_object_or_404(
            Pedido,
            pk=pedido_id
        )

        usuario = request.user

        # Verifica se o usuário é bibliotecário.
        try:
            usuario.bibliotecario
            eh_bibliotecario = True
        except ObjectDoesNotExist:
            eh_bibliotecario = False

        # Se não for bibliotecário, precisa ser o próprio leitor.
        if not eh_bibliotecario:
            try:
                leitor = usuario.leitor
            except ObjectDoesNotExist:
                raise PermissionDenied(
                    "Sua conta não possui permissão para cancelar pedidos."
                )

            if pedido.leitor_id != leitor.id:
                raise PermissionDenied(
                    "Você só pode cancelar seus próprios pedidos."
                )

        pedido = cancelar_pedido(pedido_id)

        serializer = PedidoSerializer(pedido)

        return Response(
            {
                "mensagem": "Pedido cancelado com sucesso.",
                "pedido": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class TodosPedidosAtivosView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def get_queryset(self):
        return Pedido.objects.filter(
            Q(status="pendente") |
            Q(status="aprovado", emprestimo__isnull=True) |
            Q(status="aprovado", emprestimo__data_devolucao__isnull=True)
        ).select_related(
            "leitor__usuario",
            "edicao",
            "edicao__livro",
            "exemplar",
        ).order_by("-data_pedido")