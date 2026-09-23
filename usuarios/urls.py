from django.urls import path

from . import views

urlpatterns =  [
    path("login/", views.fazer_login, name="fazer_login"),
    path("home_gestor/", views.home_gestor, name="home_gestor"),
    path("cadastrar_livro/", views.cadastrar_livro, name="cadastrar_livro"),
    path("editar_livro/<int:id>", views.editar_livro, name="editar_livro"),
    path("excluir_livro/<int:id>", views.excluir_livro, name="excluir_livro"),

    path("criar_conta", views.criar_conta, name="criar_conta"),
]