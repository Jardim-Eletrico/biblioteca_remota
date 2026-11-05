
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
    path("livros/<int:livro_id>/avaliar/", AvaliarLivro.as_view(), name="avaliar_livro"),

    # Edições
    path("edicoes/", EdicaoListCreateView.as_view(), name="edicoes"),
    path("edicoes/<int:pk>/", EdicaoDetailView.as_view(), name="edicoes-detail"),
    # Exemplares
    path(
        "edicoes/<int:edicao_id>/exemplares/",
        ExemplarLoteCreateView.as_view(),
        name="cadastrar_exemplares",
    ),

    path('exemplares/', ExemplarListView.as_view(), name="listar-exemplares"),
    

    # Autenticação
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Recuperação conta
    path(
    "password/solicitar/",
    SolicitarRecuperacaoView.as_view(),
    name="solicitar-recuperacao",
    ),

    path(
    "password/validar/",
    ValidarCodigoRecuperacaoView.as_view(),
    name="validar-recuperacao",
    ),

    path(
    "password/redefinir/",
    RedefinirSenhaView.as_view(),
    name="redefinir-senha",
    ),
    
    # Perfil
    path("perfil/", MeuPerfilView.as_view(), name='meu-perfil'),

    # Cadastro de usuário
    path("cadastro/", UsuarioCreateView.as_view(), name="cadastro"),

    # Cadastro de bibliotecário
    path('cadastro-bibliotecario/', BibliotecarioCreateView.as_view(), name='cadastro-bibliotecario'),

    # Emprestimos e pedidos:
    path('pedidos/', PedidoCreateView.as_view(), name='pedido-create'),
    path('pedidos/<int:pedido_id>/responder/', PedidoResponderView.as_view(), name='pedido-responder'),
    path('pedidos/<int:pedido_id>/efetivar_emprestimo/', EfetivarEmprestimo.as_view(), name='efetivar-emprestimo',),

    # Acessos Bibliotecario:
    path('leitores/', ListarLeitores.as_view(), name='listar-leitores'),
    path('leitores/buscar/', BuscarLeitor.as_view(), name='buscar-leitor'),
    path('emprestimos/<int:emprestimo_id>/devolver', DevolverEmprestimo.as_view(), name='devolver-emprestimo'),
]
