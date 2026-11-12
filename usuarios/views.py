from django.utils import timezone

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from drf_spectacular.utils import extend_schema, OpenApiParameter

from usuarios.models import Usuario, Leitor
from usuarios.usuario_serializer import (
    UsuarioSerializer,
    LogoutSerializer,
    MeuPerfilSerializer,
    BibliotecarioSerializer,
    BibliotecarioCadastroSerializer,
    SolicitarRecuperacaoSerializer,
    ValidarCodigoSerializer,
    RedefinirSenhaSerializer,
)

from usuarios.services import *
from .usuario_serializer import LoginSerializer

from emprestimos.models import Emprestimo

from api.permissions import *

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
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

class MeuPerfilView(generics.RetrieveAPIView):
    serializer_class = MeuPerfilSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class BibliotecarioCreateView(generics.CreateAPIView):
    serializer_class = BibliotecarioCadastroSerializer
    permission_classes = [IsBibliotecario]

class ListarLeitores(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def get(self, request):
        leitores = Leitor.objects.select_related("usuario").all()

        resultado = []

        for leitor in leitores:
            emprestimos = Emprestimo.objects.filter(
                pedido__leitor=leitor,
                data_devolucao__isnull=True
            ).select_related(
                "pedido",
                "exemplar",
                "exemplar__edicao",
                "exemplar__edicao__livro",
            )

            lista_emprestimos = []

            for emprestimo in emprestimos:
                lista_emprestimos.append({
                    "emprestimo_id": emprestimo.pk,
                    "livro": emprestimo.exemplar.edicao.livro.titulo,
                    "tombo": emprestimo.exemplar.tombo,
                    "data_retirada": emprestimo.data_retirada,
                    "data_prevista_devolucao": emprestimo.data_prevista_devolucao,
                    "atrasado": (
                        emprestimo.data_prevista_devolucao
                        < timezone.localdate()
                    )
                })

            resultado.append({
                "id": leitor.pk,
                "nome": leitor.usuario.nome,
                "email": leitor.usuario.email,
                "emprestimos": lista_emprestimos
            })

        return Response(
            resultado,
            status=status.HTTP_200_OK
        )

class BuscarLeitor(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]
    @extend_schema(
            parameters=[
            OpenApiParameter(
                name="nome",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Nome do leitor que deseja pesquisar",
                required=True,
            )
        ]
    )
    def get(self, request):
        nome = request.query_params.get("nome", "").strip()

        if not nome:
            return Response(
                {"erro": "Informe o nome do leitor."},
                status=status.HTTP_400_BAD_REQUEST
            )

        leitores = Leitor.objects.select_related("usuario").filter(
            usuario__nome__icontains=nome
        )

        resultado = []

        for leitor in leitores:
            emprestimos = Emprestimo.objects.filter(
                pedido__leitor=leitor,
                data_devolucao__isnull=True
            ).select_related(
                "exemplar",
                "exemplar__edicao",
                "exemplar__edicao__livro"
            )

            lista_emprestimos = []

            for emprestimo in emprestimos:
                lista_emprestimos.append({
                    "emprestimo_id": emprestimo.pk,
                    "livro": emprestimo.exemplar.edicao.livro.titulo,
                    "tombo": emprestimo.exemplar.tombo,
                    "data_retirada": emprestimo.data_retirada,
                    "data_prevista_devolucao": emprestimo.data_prevista_devolucao,
                    "atrasado": (
                        emprestimo.data_prevista_devolucao
                        < timezone.localdate()
                    )
                })

            resultado.append({
                "id": leitor.pk,
                "nome": leitor.usuario.nome,
                "email": leitor.usuario.email,
                "emprestimos": lista_emprestimos
            })

        return Response(resultado, status=status.HTTP_200_OK)
#-------------------------------------------------------------
@extend_schema(
    request=SolicitarRecuperacaoSerializer,
)
class SolicitarRecuperacaoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SolicitarRecuperacaoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        usuario = Usuario.objects.filter(
            email__iexact=email
        ).first()

        if usuario:
            solicitar_recuperacao(usuario)

        return Response(
            {
                "mensagem": (
                    "Se o e-mail estiver cadastrado, "
                    "você receberá um código de recuperação."
                )
            },
            status=status.HTTP_200_OK,
        )
    
@extend_schema(
    request=ValidarCodigoSerializer,
)
class ValidarCodigoRecuperacaoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ValidarCodigoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        codigo = serializer.validated_data["codigo"]

        usuario = Usuario.objects.filter(
            email__iexact=email
        ).first()

        if usuario is None or not validar_codigo(usuario, codigo):
            return Response(
                {"erro": "Código inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"mensagem": "Código validado com sucesso."},
            status=status.HTTP_200_OK,
        )

@extend_schema(
    request=RedefinirSenhaSerializer,
)
class RedefinirSenhaView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RedefinirSenhaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        codigo = serializer.validated_data["codigo"]
        nova_senha = serializer.validated_data["nova_senha"]

        usuario = Usuario.objects.filter(
            email__iexact=email
        ).first()

        if usuario is None:
            return Response(
                {"erro": "Código inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sucesso = redefinir_senha(
            usuario,
            codigo,
            nova_senha,
        )

        if not sucesso:
            return Response(
                {"erro": "Código inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"mensagem": "Senha redefinida com sucesso."},
            status=status.HTTP_200_OK,
        )