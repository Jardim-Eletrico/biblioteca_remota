from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

'''
Obtain PairView e Refresh recebem as credenciais e retornam
um par de tokens JWT automaticamente
'''

urlpatterns = [
    path('livros/', LivroListView.as_view()),
    path('livros/<int:pk>/', LivroDetailView.as_view()),

    path('login/', TokenObtainPairView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('cadastro/', UsuarioCreateView.as_view(), name="cadastro"),
]