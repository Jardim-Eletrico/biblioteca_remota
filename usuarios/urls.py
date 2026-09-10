from django.urls import path

from . import views

urlpatterns =  [
    path("login/", views.fazer_login, name="fazer_login"),
    path("home_gestor/", views.home_gestor, name="home_gestor"),
    path("cadastrar_livro/", views.cadastrar_livro, name="cadastrar_livro"),
]