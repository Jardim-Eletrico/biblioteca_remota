from django.contrib import admin
from django.urls import include, path

from api.views import RecuperacaoSenhaView

from django_rest_passwordreset.views import (
    reset_password_confirm,
    reset_password_validate_token,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Administração
    path("admin/", admin.site.urls),

    # Autenticação JWT
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # Rotas da API
    path("api/", include("api.urls")),

    # Recuperação de senha
    path(
        "api/password_reset/",
        RecuperacaoSenhaView.as_view(),
        name="password_reset",
    ),
    path(
        "api/password_reset/validate_token/",
        reset_password_validate_token,
        name="password_reset_validate",
    ),
    path(
        "api/password_reset/confirm/",
        reset_password_confirm,
        name="password_reset_confirm",
    ),

    # Documentação Swagger
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
