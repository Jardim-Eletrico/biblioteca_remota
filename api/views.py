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
