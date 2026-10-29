from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

from .serializers import *
from livros.models import Livro, Edicao
from pedidos.models import Pedido

from usuarios.models import Usuario
from .permissions import *

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import PermissionDenied

from emprestimos.services import efetivar_emprestimo

from drf_spectacular.utils import extend_schema

from django.shortcuts import get_object_or_404


# -------------------------------------------

class LivroListView(generics.ListAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]


class LivroDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario_or_Readonly]


class LivroListCreateView(generics.ListCreateAPIView):
    queryset = Livro.objects.all().order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario]

class ExemplarLoteCreateView(APIView):
    serializer_class = ExemplarLoteSerializer
    permission_classes = [IsBibliotecario]

    def post(self, request, edicao_id):
        edicao = get_object_or_404(Edicao, pk=edicao_id)

        serializer = ExemplarLoteSerializer(
            data = request.data,
            context = {'edicao': edicao}
        )

        serializer.is_valid(raise_exception=True)
        exemplares = serializer.save()

        return Response(
            {
                "mensagem": "Exemplares cadastrados com sucesso",
                "quantidade": len(exemplares),
                "exemplares": [
                    {
                        "id": exemplar.id,
                        "tombo": exemplar.tombo,
                        "status": exemplar.status,
                    }

                    for exemplar in exemplares
                ],
            },
            status=status.HTTP_201_CREATED,
        )

class LivroCreateView(generics.CreateAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario]


class EdicaoListCreateView(generics.ListCreateAPIView):
    queryset = Edicao.objects.select_related("livro").all()
    serializer_class = EdicaoSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsBibliotecario()]

        return [IsAuthenticated()]

# -------------------------------------------

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
            {"detail": "O refresh token é obrigatório."},
            status=status.HTTP_400_BAD_REQUEST
        )


        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {'detail': 'Logout realizado'}, status=status.HTTP_205_RESET_CONTENT
            )

        except TokenError:
            return Response(
                {'detail': 'Refresh token inválido'}, status=status.HTTP_404_NOT_FOUND
            )


class BibliotecarioCreateView(generics.CreateAPIView):
    serializer_class = BibliotecarioSerializer
    permission_classes = [IsBibliotecario]
# -------------------------------------------
class PedidoCreateView(generics.CreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        usuario = self.request.user

        try:
            leitor = usuario.leitor
        except ObjectDoesNotExist:
            raise PermissionDenied(
                "Sua conta não possui um perfil de leitor."
            )

        serializer.save(leitor=leitor)

class PedidoResponderView(APIView):
    serializer_class = PedidoResponderSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def post(self, request, pedido_id):
        pedido = get_object_or_404(Pedido, pk=pedido_id)

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        novo_status = serializer.validated_data["status"]

        if pedido.status != "pendente":
            return Response(
                {"erro": "Somente pedidos pendentes podem ser respondidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pedido.status = novo_status
        pedido.data_resposta = timezone.now()
        pedido.save(update_fields=["status", "data_resposta"])

        return Response(
            {
                "mensagem": "Pedido respondido com sucesso.",
                "pedido_id": pedido.pk,
                "status": pedido.status,
                "data_resposta": pedido.data_resposta,
            },
            status=status.HTTP_200_OK,
        )


class EfetivarEmprestimo(APIView):
    serializer_class = EfetivarEmprestimoSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

    @extend_schema(
            request=EfetivarEmprestimoSerializer
    )
    def post(self, request, pedido_id):
        pedido = get_object_or_404(
            Pedido,
            pk = pedido_id,
        )

        serializer = EfetivarEmprestimoSerializer(
            data = request.data,
        )
        serializer.is_valid(raise_exception=True)

        dados = serializer.validated_data

        emprestimo = efetivar_emprestimo(
            pedido_id=pedido.pk,
            exemplar_id=dados['exemplar'].pk,
            data_prevista_devolucao=dados.get(
                'data_prevista_devolucao'
            ),
        )

        return Response(
            {
                "mensagem": "Empréstimo efetivado com sucesso",
                "emprestimo": {
                    "id": emprestimo.pk,
                    "pedido_id": emprestimo.pedido_id,
                    "exemplar_id": emprestimo.exemplar_id,
                    "tombo": emprestimo.exemplar.tombo,
                    "data_retirada": emprestimo.data_retirada,
                    "data_prevista_devolucao": (
                        emprestimo.data_prevista_devolucao
                    ),
                    "data_devolucao": emprestimo.data_devolucao
                },
            },
            status=status.HTTP_201_CREATED
        )