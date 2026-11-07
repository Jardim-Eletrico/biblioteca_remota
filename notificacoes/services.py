from .models import Notificacao
from desejos.models import ListaDesejo

def notificar_usuarios_lista_desejos(edicao):

    desejos = ListaDesejo.objects.filter(
        edicao=edicao,
        aguardando_disponibilidade=True
    )

    notificacoes = [
        Notificacao(
            usuario=desejo.usuario,
            titulo="Livro disponível!",
            mensagem=(
                f'O livro "{edicao.livro.titulo}" '
                "voltou a ter exemplares disponíveis."
            )
        )
        for desejo in desejos
    ]

    Notificacao.objects.bulk_create(notificacoes)

    desejos.update(
        aguardando_disponibilidade=False
    )

def notificar_emprestimo_efetivado(emprestimo):
    Notificacao.objects.create(
        usuario=emprestimo.pedido.leitor.usuario,
        titulo="Empréstimo realizado!",
        mensagem=(
            f'O empréstimo do livro '
            f'"{emprestimo.exemplar.edicao.livro.titulo}" '
            "foi registrado com sucesso. "
            f"A data prevista para devolução é "
            f"{emprestimo.data_prevista_devolucao:%d/%m/%Y}."
        )
    )
    
def notificar_aprovacao_pedido(pedido):
    Notificacao.objects.create(
        usuario=pedido.leitor.usuario,
        titulo="Reserva aprovada!",
        mensagem=(
            f'Sua reserva do livro "{pedido.edicao.livro.titulo}" '
            "foi aprovada. "
            "Compareça à biblioteca para retirar o exemplar."
        )
    )

def notificar_cancelamento_pedido(pedido):
    Notificacao.objects.create(
        usuario=pedido.leitor.usuario,
        titulo="Pedido cancelado!",
        mensagem=(
            f'Seu pedido do livro "{pedido.edicao.livro.titulo}" '
            "foi cancelado."
        )
    )


