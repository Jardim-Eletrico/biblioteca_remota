
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import *

urlpatterns = [
    # Livros
    path("livros/", LivroListView.as_view(), name="livros"),
    path("livros/cadastrar/", LivroCreateView.as_view(), name="cadastrar_livro"),
    path("livros/<int:pk>/", LivroDetailView.as_view(), name="detalhar_livro"),

    # Edições
    path("edicoes/", EdicaoListCreateView.as_view(), name="edicoes"),

    # Exemplares
    path(
        "edicoes/<int:edicao_id>/exemplares/",
        ExemplarLoteCreateView.as_view(),
        name="cadastrar_exemplares",
    ),

    # Autenticação
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Cadastro de usuário
    path("cadastro/", UsuarioCreateView.as_view(), name="cadastro"),

    # Cadastro de bibliotecário
    path('cadastro-bibliotecario/', BibliotecarioCreateView.as_view(), name='cadastro-bibliotecario'),

    # Emprestimos e pedidos:
    path('pedidos/', PedidoCreateView.as_view(), name='pedido-create'),
    path('pedidos/<int:pedido_id>/responder/', PedidoResponderView.as_view(), name='pedido-responder'),
    path('pedidos/<int:pedido_id>/efetivar_emprestimo/', EfetivarEmprestimo.as_view(), name='efetivar-emprestimo',),
]
