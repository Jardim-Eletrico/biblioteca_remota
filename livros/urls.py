
from django.urls import path

from api.views import (
    LivroListView,
    LivroDetailView,
    LivroCreateView,
    ExemplarLoteCreateView,
    EdicaoListCreateView,
    LivrosRecomendadosView
)

urlpatterns = [
    
    path(
        "acervo/",
        LivroListView.as_view(),
        name="mostrar_livros",
    ),
    path(
        "acervo/cadastrar/",
        LivroCreateView.as_view(),
        name="cadastrar_livro",
    ),
    path(
        "acervo/<int:pk>/",
        LivroDetailView.as_view(),
        name="detalhar_livro",
    ),

    
    path(
        "edicoes/",
        EdicaoListCreateView.as_view(),
        name="edicoes",
    ),

    
    path(
        "edicoes/<int:edicao_id>/exemplares/",
        ExemplarLoteCreateView.as_view(),
        name="cadastrar_exemplares",
    ),

    path(
        "<int:livro_id>/recomendados/",
        LivrosRecomendadosView.as_view(),
        name="livros-recomendados",
    ),
]
