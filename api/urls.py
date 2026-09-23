from django.urls import path
from .views import *
from rest_framework_simplejwt.views import(
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('livros/', LivroListCreateView.as_view()),
    path('livros/<int:pk>/', LivroDetailView.as_view()),

    path('login/', EmailLoginView.as_view(), name="login"),
    path('login/refresh/', TokenRefreshView.as_view(), name="token_refresh"),

    path('cadastro/', UsuarioCreateView.as_view(), name="cadastro"),
]