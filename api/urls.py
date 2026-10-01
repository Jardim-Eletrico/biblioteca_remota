from django.urls import path
from .views import *

urlpatterns = [
    path('livros/', LivroListCreateView.as_view()),
    path('livros/<int:pk>/', LivroDetailView.as_view()),

    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('cadastro/', UsuarioCreateView.as_view(), name="cadastro"),
]