from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

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