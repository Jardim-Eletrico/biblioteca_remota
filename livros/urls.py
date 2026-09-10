from django.urls import path

from . import views

urlpatterns =  [
    path("acervo/", views.mostrar_livros, name="mostrar_livros"),
    
]