
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# Views de livros
from livros.views import (
    LivroListView,
    LivroDetailView,
    LivroListCreateView,
    LivroCreateView,
    EdicaoListCreateView,
    EdicaoDetailView,
    ExemplarBaixaView,
    ExemplarDetailView,
    ExemplarPublicoListView,
    ExemplarPublicoDetailView,
    ExemplarListView,
    ExemplarLoteCreateView,
    AvaliarLivro,
)

# Views de usuários
from usuarios.views import (
    LoginView,
    LogoutView,
    MeuPerfilView,
    UsuarioCreateView,
    BibliotecarioCreateView,
    ListarLeitores,
    BuscarLeitor,
    SolicitarRecuperacaoView,
    ValidarCodigoRecuperacaoView,
    RedefinirSenhaView,
)

from desejos.views import *

# Views de empréstimos e pedidos
from pedidos.views import *
from emprestimos.views import *

# Views de notificacoes
from notificacoes.views import *

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
    path('edicoes/public/<int:edicao_id>/exemplares/', ExemplarPublicoListView.as_view(), name='exemplares-da-edicao'),
    path('exemplares/<int:pk>/', ExemplarDetailView.as_view(), name="detalhar_exemplar"),
    path('exemplares/', ExemplarListView.as_view(), name="listar-exemplares"),
    path('exemplares/<int:pk>/baixa/', ExemplarBaixaView.as_view(), name="baixar-exemplar"),
    path('exemplares/public/<int:pk>/', ExemplarPublicoDetailView.as_view(), name='exemplar-publico-detail'),
    

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
    path('emprestimos/', EmprestimoListView.as_view(), name="listar-emprestimos"),

    # Acessos Bibliotecario:
    path('leitores/', ListarLeitores.as_view(), name='listar-leitores'),
    path('leitores/buscar/', BuscarLeitor.as_view(), name='buscar-leitor'),
    path('emprestimos/<int:emprestimo_id>/devolver', DevolverEmprestimo.as_view(), name='devolver-emprestimo'),

    # Desejos
    path("desejos/", ListaDesejoListCreateView.as_view(), name="lista-desejos"),
    path("desejos/<int:pk>/", ListaDesejoDeleteView.as_view(), name="remover-desejo"),

    # Notificacoes
    path("notificacoes/", NotificacaoListView.as_view(), name="listar-notificacoes"),
    path("notificacoes/<int:pk>/", NotificacaoLidaView.as_view(), name="marcar-notificacao-lida"),
    path("notificacoes/<int:pk>/excluir/",NotificacaoDeleteView.as_view(),name="excluir-notificacao"),
]
