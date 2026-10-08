from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import *
from livros.models import Livro
from usuarios.models import Usuario
from .permissions import *


# -------------------------------------------

class LivroListView(generics.ListAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]


class LivroDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario_or_Readonly]


class LivroCreateView(generics.CreateAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario]


# -------------------------------------------

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
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

