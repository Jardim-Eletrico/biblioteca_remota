from rest_framework import serialializers
from .models import Carrinho, ItemCarrinho

class CarrinhoSerializer(serialializers.ModelSerializer):
    class Meta:
        model = Carrinho
        fields = ["id", "usuario", "data_criacao"]