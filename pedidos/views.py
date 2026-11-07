from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from pedidos.models import Pedido
from .pedidos_serializer import (
    PedidoSerializer,
    PedidoResponderSerializer,
)

from api.permissions import IsBibliotecario

class PedidoCreateView(generics.CreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        usuario = self.request.user

        try:
            leitor = usuario.leitor
        except ObjectDoesNotExist:
            raise PermissionDenied(
                "Sua conta não possui um perfil de leitor."
            )

        serializer.save(leitor=leitor)

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

        pedido.status = novo_status
        pedido.data_resposta = timezone.now()
        pedido.save(update_fields=["status", "data_resposta"])

        return Response(
            {
                "mensagem": "Pedido respondido com sucesso.",
                "pedido_id": pedido.pk,
                "status": pedido.status,
                "data_resposta": pedido.data_resposta,
            },
            status=status.HTTP_200_OK,
        )
