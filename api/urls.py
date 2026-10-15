
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    LivroListView,
    LivroDetailView,
    LivroCreateView,
    EdicaoListCreateView,
    ExemplarLoteCreateView,
    LogoutView,
    UsuarioCreateView,
)

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
]
