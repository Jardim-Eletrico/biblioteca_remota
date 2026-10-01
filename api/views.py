from django.contrib.auth import authenticate, login, logout

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from livros.models import Livro
from usuarios.models import Usuario

class LivroListCreateView(generics.ListCreateAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [AllowAny]



class LivroDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer


class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = []

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        usuario = authenticate(
            request,
            username = username,
            password = password,
        )

        if usuario is None:
            return Response(
                {"detail": "Usuário ou senha inválidos"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, usuario)

        return Response({
            "id": usuario.id,
            "username": usuario.username,
            "email": usuario.email,
            "nome": usuario.nome,
        })

class LogoutView(APIView):
    def post(self, request):
        logout(request)

        return Response({
            "detail": "Logout realizado"
        })