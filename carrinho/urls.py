from django.urls import path
from .views import CarrinhoView

urlpatterns = [
    path("", CarrinhoView.as_view(), name="carrinho"),
    path("<int:item_id>/", CarrinhoView.as_view(), name="remover-item"),
]