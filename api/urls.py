from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    path('livros/', LivroListView.as_view()),
    path('livros/<int:pk>/', LivroDetailView.as_view()),

    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('cadastro/', UsuarioCreateView.as_view(), name="cadastro"),
]