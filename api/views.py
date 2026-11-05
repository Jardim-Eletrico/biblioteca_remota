# Django
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.utils import timezone

# Django REST Framework
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter

# Simple JWT
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

# Recuperação de senha
from usuarios.services import solicitar_recuperacao

# drf-spectacular
from drf_spectacular.utils import extend_schema, OpenApiParameter

# Aplicação
from .serializers import *
from .permissions import *

# Modelos
from livros.models import Livro, Edicao, Exemplar
from pedidos.models import Pedido
from usuarios.models import Usuario

# Serviços
from emprestimos.services import efetivar_emprestimo, devolver_emprestimo
from usuarios.services import(solicitar_recuperacao, validar_codigo, redefinir_senha)
from livros.services import avaliar_livro

Usuario = get_user_model()

# -------------------------------------------
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

# -------------------------------------------

class ExemplarListView(ListAPIView):
    queryset = Exemplar.objects.select_related(
        "edicao",
        "edicao__livro"
    ).all()

    serializer_class = ExemplarListSerializer

    permission_classes = [
        IsAuthenticated,
        IsBibliotecario
    ]

    filter_backends = [SearchFilter]

    search_fields = [
        "tombo",
        "edicao__livro__titulo",
        "edicao__livro__autor",
    ]

    def get_queryset(self):
        queryset = super().get_queryset()

        exemplar_id = self.request.query_params.get('id')

        if exemplar_id:
            queryset = queryset.filter(id=exemplar_id)

            if not queryset.exists():
                raise NotFound("Exemplar não encontrado.")
            
        return queryset

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        if not queryset.exists():
            raise NotFound(
                "Nenhum exemplar encontrado com os dados informados"
            )

        return queryset
    
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

class AvaliarLivro(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
            request=AvalicaoSerializer,
            responses={201, AvalicaoSerializer},
    )
    def post(self, request, livro_id):
        serializer = AvalicaoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        leitor = Leitor.objects.filter(
            usuario = request.user
        ).first()

        if leitor is None:
            return Response(
                {"erro": "Apenas leitores podem avaliar livros"},
                status=status.HTTP_403_FORBIDDEN,
            )

        livro = get_object_or_404(Livro, pk=livro_id)

        avaliacao = avaliar_livro(
            leitor=leitor,
            livro=livro,
            nota=serializer.validated_data["nota"],
        )

        return Response(
            {
                "mensagem": "Avalicação registrada com sucesso",
                "avaliação_id": avaliacao.pk,
                "livro_id": livro.pk,
                "nota": avaliacao.nota,
                "data_avaliacao": avaliacao.data_avaliacao,
            },
            status=status.HTTP_201_CREATED,
        )
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

class MeuPerfilView(generics.RetrieveAPIView):
    serializer_class = MeuPerfilSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class BibliotecarioCreateView(generics.CreateAPIView):
    serializer_class = BibliotecarioSerializer
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

class DevolverEmprestimo(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def post(self, request, emprestimo_id):
        emprestimo = devolver_emprestimo(emprestimo_id)
        return Response(
            {
                "mensagem": "Empréstimo devolvido com sucesso.",
                "emprestimo_id": emprestimo.pk,
                "data_devolucao": emprestimo.data_devolucao,
                "exemplar_id": emprestimo.exemplar_id,
                "status_exemplar": "disponivel",
            },
            status=status.HTTP_200_OK,
        )
# -------------------------------------------
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