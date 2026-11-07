from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from .models import ListaDesejo
from .desejos_serializer import ListaDesejoSerializer


class ListaDesejoListCreateView(ListCreateAPIView):
    serializer_class = ListaDesejoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ListaDesejo.objects.filter(
            usuario=self.request.user
        ).select_related(
            "edicao",
            "edicao__livro"
        ).order_by("-data_adicao")

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class ListaDesejoDeleteView(DestroyAPIView):
    serializer_class = ListaDesejoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ListaDesejo.objects.filter(
            usuario=self.request.user
        )