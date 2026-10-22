from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import *
from livros.models import Livro, Edicao

from usuarios.models import Usuario
from .permissions import *


from django.shortcuts import get_object_or_404


# -------------------------------------------

class LivroListView(generics.ListAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]


class LivroDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario_or_Readonly]


class LivroListCreateView(generics.ListCreateAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario]

class ExemplarLoteCreateView(APIView):
    serializer_class = ExemplarLoteSerializer
    permission_classes = [IsBibliotecario]

    def post(self, request, edicao_id):
        edicao = get_object_or_404(Edicao, pk=edicao_id)

        serializer = ExemplarLoteSerializer(
            data = request.data,
            context = {'edicao': edicao}
        )

        serializer.is_valid(raise_exception=True)
        exemplares = serializer.save()

        return Response(
            {
                "mensagem": "Exemplares cadastrados com sucesso",
                "quantidade": len(exemplares),
                "exemplares": [
                    {
                        "id": exemplar.id,
                        "tombo": exemplar.tombo,
                        "status": exemplar.status,
                    }

                    for exemplar in exemplares
                ],
            },
            status=status.HTTP_201_CREATED,
        )

class LivroCreateView(generics.CreateAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario]


class EdicaoListCreateView(generics.ListCreateAPIView):
    queryset = Edicao.objects.select_related("livro").all()
    serializer_class = EdicaoSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsBibliotecario()]

        return [IsAuthenticated()]

# -------------------------------------------

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        try:
            if not refresh_token:
                return Response(
                    
                        {"detail": "Logout realizado"},
                        status=status.HTTP_205_RESET_CONTENT
                    
                )

        except Exception:
            return Response(

                {"detail": "Refresh token inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )


class BibliotecarioCreateView(generics.CreateAPIView):
    serializer_class = BibliotecarioSerializer
    permission_classes = [IsBibliotecario]