from .models import Notificacao
from desejos.models import ListaDesejo

def notificar_usuarios_lista_desejos(edicao):
    usuarios_ids = ListaDesejo.objects.filter(
        edicao=edicao
    ).values_list("usuario_id", flat=True)

    notificacoes = [
        Notificacao(
            usuario_id=usuario_id,
            titulo="Livro disponível!",
            mensagem=(
                f'O livro "{edicao.livro.titulo}" '
                "voltou a ter exemplares disponíveis."
            )
        )
        for usuario_id in usuarios_ids
    ]

    Notificacao.objects.bulk_create(notificacoes)


def notificar_aprovacao_pedido(pedido):
    Notificacao.objects.create(
        usuario=pedido.leitor.usuario,
        titulo="Reserva Aprovada",
        mensagem = (
            f'Sua reserva do livro'
            f'"{pedido.edicao.livro.titulo}" foi aprovada'
            f"Compareça à biblioteca para retirar o exemplar"
        )
    )