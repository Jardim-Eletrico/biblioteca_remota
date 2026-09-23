from rest_framework import generics

from .serializers import *
from livros.models import Livro
from usuarios.models import Usuario

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer


class LivroListCreateView(generics.ListCreateAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer


class LivroDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer


class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = []

class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer