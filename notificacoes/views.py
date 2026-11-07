from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import DestroyAPIView

from .models import Notificacao
from .notificacoes_serializer import NotificacaoSerializer


class NotificacaoListView(ListAPIView):
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notificacao.objects.filter(
            usuario=self.request.user
        ).order_by("-data_criacao")


class NotificacaoLidaView(UpdateAPIView):
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notificacao.objects.filter(
            usuario=self.request.user
        )

    def update(self, request, *args, **kwargs):
        notificacao = self.get_object()
        notificacao.lida = True
        notificacao.save(update_fields=["lida"])

        return Response(
            self.get_serializer(notificacao).data
        )
    
class NotificacaoDeleteView(DestroyAPIView):
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notificacao.objects.filter(
            usuario=self.request.user
        )