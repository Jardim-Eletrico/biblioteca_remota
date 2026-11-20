from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from django.db.models import Avg, Count, F, Prefetch, Q

from django.db import transaction

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

from livros.models import Livro, Edicao, Exemplar, CDD
from livros.livro_serializer import (
    LivroSerializer,
    EdicaoSerializer,
    ExemplarListSerializer,
    ExemplarPublicoSerializer,
    ExemplarLoteSerializer,
    ExemplarBaixaSerializer,
    AvalicaoSerializer,
    CDDSerializer,
    LivroRecomendadoSerializer
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

from django.db.models import Max

from datetime import timedelta

from django.db.models import (
    Count,
    Max,
    OuterRef,
    Subquery,
    IntegerField,
    Value,
)
from django.db.models.functions import Coalesce
from django.utils import timezone

from emprestimos.models import Emprestimo
def livros_com_avaliacoes():
    return Livro.objects.annotate(
        media_avaliacoes=Avg("avaliacoes__nota"),
        quantidade_avaliacoes=Count(
            "avaliacoes",
            distinct=True
        )
    )

class ExemplarBaixaView(APIView):
    permission_classes = [IsAuthenticated, IsBibliotecario]

    @extend_schema(
        request=ExemplarBaixaSerializer,
        responses={200: None},
    )
    @transaction.atomic
    def post(self, request, pk):
        exemplar = get_object_or_404(
            Exemplar.objects.select_for_update(),
            pk=pk,
        )

        serializer = ExemplarBaixaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if exemplar.status == "baixado":
            raise ValidationError(
                "Este exemplar já foi baixado."
            )

        if exemplar.status == "reservado":
            raise ValidationError(
                "Não é possível baixar um exemplar reservado."
            )

        emprestimo = None

        if exemplar.status == "emprestado":
            emprestimo = (
                Emprestimo.objects
                .select_for_update()
                .filter(
                    exemplar=exemplar,
                    data_devolucao__isnull=True,
                )
                .first()
            )

            if emprestimo is None:
                raise ValidationError(
                    "Não foi encontrado um empréstimo ativo para este exemplar."
                )

            emprestimo.data_devolucao = timezone.now()
            emprestimo.situacao_encerramento = (
                Emprestimo.SituacaoEncerramento.PERDIDO
            )

            emprestimo.save(
                update_fields=[
                    "data_devolucao",
                    "situacao_encerramento",
                ]
            )

        elif exemplar.status not in ["disponivel", "indisponivel"]:
            raise ValidationError(
                "A situação atual do exemplar não permite a baixa."
            )

        exemplar.status = "baixado"
        exemplar.data_baixa = timezone.now()
        exemplar.motivo_baixa = serializer.validated_data[
            "motivo_baixa"
        ]

        exemplar.save(
            update_fields=[
                "status",
                "data_baixa",
                "motivo_baixa",
            ]
        )

        return Response(
            {"mensagem": "Exemplar baixado com sucesso."},
            status=status.HTTP_200_OK,
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


class ListarCDDsView(generics.ListAPIView):
    queryset = CDD.objects.all().order_by("codigo")
    serializer_class = CDDSerializer
    permission_classes = [IsAuthenticated]

class LivroPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 10
    
class LivroListView(generics.ListAPIView):
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = LivroPagination

    filter_backends = [SearchFilter]
    search_fields = ["titulo", "autor"]

    def get_queryset(self):
        queryset = livros_com_avaliacoes().prefetch_related("edicoes")

        ordenacao = self.request.query_params.get("ordenacao")

        # MAIS LIDOS: empréstimos totais
        if ordenacao == "mais_lidos":

            emprestimos = (
                Emprestimo.objects
                .filter(
                    pedido__edicao__livro=OuterRef("pk"),
                    data_retirada__isnull=False
                )
                .order_by()
                .values("pedido__edicao__livro")
                .annotate(total=Count("pk"))
                .values("total")[:1]
            )

            queryset = queryset.annotate(
                total_emprestimos=Coalesce(
                    Subquery(emprestimos, output_field=IntegerField()),
                    Value(0)
                )
            ).order_by("-total_emprestimos", "titulo")

        # EM DESTAQUE: empréstimos nos últimos 7 dias
        elif ordenacao == "destaque":

            emprestimos = (
                Emprestimo.objects
                .filter(
                    pedido__edicao__livro=OuterRef("pk"),
                    data_retirada__gte=timezone.now() - timedelta(days=7),
                    data_retirada__isnull=False
                )
                .order_by()
                .values("pedido__edicao__livro")
                .annotate(total=Count("pk"))
                .values("total")[:1]
            )

            queryset = queryset.annotate(
                emprestimos_semana=Coalesce(
                    Subquery(emprestimos, output_field=IntegerField()),
                    Value(0)
                )
            ).order_by("-emprestimos_semana", "titulo")

        # NOVOS: data de cadastro da edição mais recente
        elif ordenacao == "recentes":

            queryset = queryset.annotate(
                data_ultima_edicao=Max("edicoes__data_de_criacao")
            ).order_by(
                F("data_ultima_edicao").desc(nulls_last=True),
                "titulo"
            )

        else:
            ordenar = self.request.query_params.get("ordenar")

            if ordenar == "popularidade":
                queryset = queryset.order_by(
                    "-quantidade_avaliacoes",
                    "-media_avaliacoes",
                    "titulo"
                )

            elif ordenar == "melhor_nota":
                queryset = queryset.order_by(
                    F("media_avaliacoes").desc(nulls_last=True),
                    "-quantidade_avaliacoes",
                    "titulo"
                )

            else:
                queryset = queryset.order_by("titulo")

        return queryset

class LivroDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Livro.objects.annotate(
        media_avaliacoes=Avg("avaliacoes__nota"),
        quantidade_avaliacoes=Count(
            "avaliacoes",
            distinct=True
        )
    )

    serializer_class = LivroSerializer
    permission_classes = [IsBibliotecario_or_Readonly]

class LivroListCreateView(generics.ListCreateAPIView):
    queryset = livros_com_avaliacoes()
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

    def get_permissions(self):
        if self.request.method in ["GET", "HEAD", "OPTIONS"]:
            return [IsAuthenticated()]

        return [IsAuthenticated(), IsBibliotecario()]

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
                "avaliaçao_id": avaliacao.pk,
                "livro_id": livro.pk,
                "nota": avaliacao.nota,
                "data_avaliacao": avaliacao.data_avaliacao,
            },
            status=status.HTTP_201_CREATED,
        )



class LivrosRecomendadosView(APIView):
    permission_classes = [IsAuthenticated]

    QUANTIDADE_RECOMENDACOES = 10

    def normalizar_generos(self, generos):
        return {
            genero.strip().casefold()
            for genero in generos.split(",")
            if genero.strip()
        }

    def calcular_pontuacao(self, livro_atual, candidato):
        generos_atuais = self.normalizar_generos(
            livro_atual.generos
        )

        generos_candidato = self.normalizar_generos(
            candidato.generos
        )

        generos_comuns = generos_atuais & generos_candidato

        # Cada gênero em comum acrescenta 3 pontos.
        pontuacao = len(generos_comuns) * 3

        cdd_atual = livro_atual.cdd
        cdd_candidato = candidato.cdd

        if cdd_atual and cdd_candidato:
            # Mesmo CDD.
            if cdd_atual.pk == cdd_candidato.pk:
                pontuacao += 5

            # CDD pai ou filho diretamente relacionado.
            elif (
                cdd_atual.pai_id == cdd_candidato.pk
                or cdd_candidato.pai_id == cdd_atual.pk
            ):
                pontuacao += 2

        return pontuacao

    def get(self, request):
        livro_ids = request.query_params.getlist("livros")

        if not livro_ids:
            return Response(
                {"erro": "Informe pelo menos um livro."},
                status=400
            )

        livros_atuais = list(
            Livro.objects.filter(
                pk__in=livro_ids
            ).select_related("cdd", "cdd__pai")
        )

        if len(livros_atuais) != len(set(livro_ids)):
            return Response(
                {"erro": "Um ou mais livros não foram encontrados."},
                status=404
            )


        edicoes_com_disponibilidade = (
            Edicao.objects.annotate(
                exemplares_disponiveis=Count(
                    "exemplares",
                    filter=Q(exemplares__status="disponivel"),
                )
            )
            .order_by(
                "-exemplares_disponiveis",
                "-ano_publicacao",
                "id",
            )
        )

        candidatos = (
            Livro.objects.filter(edicoes__isnull=False)
            .exclude(pk__in=[livro.pk for livro in livros_atuais])
            .select_related("cdd", "cdd__pai")
            .prefetch_related(
                Prefetch(
                    "edicoes",
                    queryset=edicoes_com_disponibilidade,
                    to_attr="edicoes_recomendacao",
                )
            )
            .distinct()
        )

        recomendacoes = []

        for candidato in candidatos:
            pontuacao = sum(
                self.calcular_pontuacao(livro_atual, candidato)
                for livro_atual in livros_atuais
            )

            if pontuacao == 0:
                continue

            if not candidato.edicoes_recomendacao:
                continue

            # Prioriza a edição com mais exemplares disponíveis.
            edicao = candidato.edicoes_recomendacao[0]

            recomendacoes.append({
                "livro": candidato,
                "edicao": edicao,
                "pontuacao": pontuacao,
            })

        recomendacoes.sort(
            key=lambda item: (
                -item["pontuacao"],
                item["livro"].titulo.casefold(),
            )
        )

        resultados = [
            {
                "livro": item["livro"],
                "edicao": item["edicao"],
            }
            for item in recomendacoes[:self.QUANTIDADE_RECOMENDACOES]
        ]

        serializer = LivroRecomendadoSerializer(
            resultados,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)

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