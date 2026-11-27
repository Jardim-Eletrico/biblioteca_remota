from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Carrinho, ItemCarrinho
from .itens_carrinho_serializers import ItemCarrinhoSerializer
from livros.models import Edicao

class CarrinhoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        carrinho, criado = Carrinho.objects.get_or_create(
            usuario=request.user
        )

        itens = carrinho.itens.select_related(
            "edicao__livro__cdd"
        ).all()

        serializer = ItemCarrinhoSerializer(
            itens,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)

    def post(self, request):
        edicao_id = request.data.get("edicao")


        if not edicao_id:
            return Response(
                {"erro": "O ID da edição é obrigatório."},
                status=400
            )

        edicao = Edicao.objects.filter(
            id=edicao_id
        ).first()


        if edicao is None:
            return Response(
                {"erro": "Edição não encontrada."},
                status=404
            )

        if not edicao.exemplares.exclude(status="baixado").exists():
            return Response(
                {"erro": "Esta edição não possui exemplares disponíveis para empréstimo."},
                status=400
            )


        carrinho, criado = Carrinho.objects.get_or_create(
            usuario=request.user
        )

        item_existente = ItemCarrinho.objects.filter(
            carrinho=carrinho,
            edicao=edicao
        ).exists()

        if item_existente:
            return Response(
                {"erro": "Essa edição já está no carrinho."},
                status=200
            )

        quantidade_itens = carrinho.itens.count()

        if quantidade_itens >= 2:
            return Response(
                {"erro": "O limite de 2 livros no carrinho foi atingido."},
                status=400
            )

        item, criado = ItemCarrinho.objects.get_or_create(
            carrinho=carrinho,
            edicao_id=edicao_id
        )   

        serializer = ItemCarrinhoSerializer(item)

        return Response(
            serializer.data,
            status=201 if criado else 200
        )

    
    def delete(self, request, item_id):
        item = ItemCarrinho.objects.filter(
            id=item_id,
            carrinho__usuario=request.user
        ).first()

        if item is None:
            return Response(
                {"erro": "Item não encontrado no carrinho."},
                status=404
            )

        item.delete()

        return Response(status=204)