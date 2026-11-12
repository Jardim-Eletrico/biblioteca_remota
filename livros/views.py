from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter

from drf_spectacular.utils import extend_schema

from livros.models import Livro, Edicao, Exemplar
from livros.livro_serializer import (
    LivroSerializer,
    EdicaoSerializer,
    ExemplarListSerializer,
    ExemplarPublicoSerializer,
    ExemplarLoteSerializer,
    ExemplarBaixaSerializer,
    AvalicaoSerializer,
)

from usuarios.models import Leitor
from api.permissions import (
    IsBibliotecario,
    IsBibliotecario_or_Readonly,
)

from emprestimos.models import Emprestimo
from pedidos.models import Pedido
from emprestimos.emprestimo_serializer import (
    EmprestimoSerializer,
    EfetivarEmprestimoSerializer,
)
from emprestimos.services import (
    efetivar_emprestimo,
    devolver_emprestimo,
)

from rest_framework.pagination import LimitOffsetPagination

from livros.services import avaliar_livro

class ExemplarBaixaView(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]

    @extend_schema(
            request=ExemplarBaixaSerializer,
            responses={200, None}
    )
    def post(self, request, pk):
        exemplar = get_object_or_404(Exemplar, pk=pk)

        serializer = ExemplarBaixaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if exemplar.status in ["emprestado", "reservado"]:
            raise ValidationError(
                "Não é possível fazer a baixa patrimonial de um exemplar emprestado, ou reservado."
            )

        if exemplar.status == "baixado":
            raise ValidationError(
                "Este exemplar já foi baixado"
            )

        exemplar.status = "baixado"
        exemplar.data_baixa = timezone.now()
        exemplar.motivo_baixa = serializer.validated_data["motivo_baixa"]

        exemplar.save()

        return Response(
            {"mensagem": "Exemplar baixado com sucesso"},
            status=status.HTTP_200_OK
        )

class ExemplarDetailView(RetrieveDestroyAPIView):
    queryset = Exemplar.objects.select_related(
        "edicao",
        "edicao__livro",
    )

    serializer_class = ExemplarListSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

    def perform_destroy(self, instance):
        if instance.emprestimos.exists():
            raise ValidationError(
                "Não é possível excluir um exemplar que possui histórico de empréstimos. Utilize a baixa patrimonial."
            )

        instance.delete()

class ExemplarPublicoListView(ListAPIView):
    serializer_class = ExemplarPublicoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Exemplar.objects.filter(
            edicao_id=self.kwargs["edicao_id"]
        ).exclude(status='baixado').select_related(
            'edicao',
            'edicao__livro'
        )

        status_filtro = self.request.query_params.get(
            'status',
            'todos'
        )

        if status_filtro == 'disponivel':
            queryset = queryset.filter(status='disponivel')

        elif status_filtro == 'emprestado':
            queryset = queryset.filter(status='emprestado')

        elif status_filtro != 'todos':
            raise ValidationError({
                "status": "Filtro inválido"
            })

        return queryset

class ExemplarPublicoDetailView(RetrieveAPIView):
    serializer_class = ExemplarPublicoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Exemplar.objects.exclude(
            status="baixado"
        ).select_related(
            "edicao",
            "edicao__livro"
        )

    def retrieve(self, request, *args, **kwargs):
        exemplar = get_object_or_404(
            Exemplar,
            pk=kwargs["pk"]
        )

        if exemplar.status == "baixado":
            return Response(
                {
                    "mensagem": (
                        "Este exemplar não está mais disponível no acervo, "
                        "pois foi baixado do patrimônio."
                    )
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(exemplar)
        return Response(serializer.data)
    

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

        situacao = self.request.query_params.get(
            "situacao",
            "nao_baixados"
        )

        if situacao == "baixado":
            return queryset.filter(status="baixado")

        elif situacao == "nao_baixados":
            return queryset.exclude(status="baixado")

        elif situacao == "todos":
            return queryset

        raise ValidationError({
            "situacao": "Filtro inválido."
        })

class LivroPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 10
    
class LivroListView(generics.ListAPIView):
    queryset = Livro.objects.prefetch_related("edicoes").order_by("titulo")
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = LivroPagination

    filter_backends = [SearchFilter]
    search_fields = ["titulo", "autor"]


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


class EdicaoPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 10

class EdicaoListCreateView(generics.ListCreateAPIView):
    queryset = Edicao.objects.select_related("livro").all()
    serializer_class = EdicaoSerializer
    pagination_class = EdicaoPagination

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsBibliotecario()]

        return [IsAuthenticated()]

class EdicaoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Edicao.objects.all()
    serializer_class = EdicaoSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

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
class EmprestimoListView(ListAPIView):
    queryset = Emprestimo.objects.select_related(
        "pedido__leitor__usuario",
        "pedido__edicao__livro",
        "exemplar",
    ).all().order_by("-data_retirada")

    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated, IsBibliotecario]

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