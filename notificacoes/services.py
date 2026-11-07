from .models import Notificacao
from desejos.models import ListaDesejo

from datetime import timedelta
from django.utils import timezone

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

def notificar_devolucoes_proximas():
    from emprestimos.models import Emprestimo

    hoje = timezone.localdate()
    data_limite = hoje + timedelta(days=2)

    emprestimos = Emprestimo.objects.filter(
        data_prevista_devolucao = data_limite,
        data_devolucao__isnull = True
    ).select_related(
        'pedido__leitor__usuario',
        'exemplar__edicao__livro'
    )

    total_notificacoes = 0

    for emprestimo in emprestimos:
        usuario = emprestimo.pedido.leitor.usuario

        ja_notificado = Notificacao.objects.filter(
            usuario = usuario,
            emprestimo = emprestimo,
            titulo = "AVISO DE PRAZO DE DEVOLUÇÃO"
        ).exists()

        if ja_notificado:
            continue

        livro = emprestimo.exemplar.edicao.livro

        Notificacao.objects.create(
            usuario = usuario,
            emprestimo = emprestimo,
            titulo = 'AVISO DE PRAZO DE DEVOLUÇÃO',
            mensagem = (
                f'O prazo para devolver o livro "{livro.titulo}" '
                f'é daqui a 2 dias, em '
                f'{emprestimo.data_prevista_devolucao:%d/%m/%Y}.')
        )

        total_notificacoes += 1

    return total_notificacoes

def notificar_emprestimos_atrasados():
    from emprestimos.models import Emprestimo

    hoje = timezone.localdate()

    emprestimos = Emprestimo.objects.filter(
        data_prevista_devolucao__lt=hoje,
        data_devolucao__isnull=True
    ).select_related(
        "pedido__leitor__usuario",
        "exemplar__edicao__livro"
    )

    total_notificacoes = 0

    for emprestimo in emprestimos:
        usuario = emprestimo.pedido.leitor.usuario

        ja_notificado = Notificacao.objects.filter(
            usuario=usuario,
            emprestimo=emprestimo,
            titulo="Empréstimo em atraso!"
        ).exists()

        if ja_notificado:
            continue

        livro = emprestimo.exemplar.edicao.livro

        Notificacao.objects.create(
            usuario=usuario,
            emprestimo=emprestimo,
            titulo="Empréstimo em atraso!",
            mensagem=(
                f'O prazo para devolver o livro "{livro.titulo}" '
                f'venceu em '
                f'{emprestimo.data_prevista_devolucao:%d/%m/%Y}. '
                "Por favor, devolva a obra à biblioteca."
            )
        )

        total_notificacoes += 1

    return total_notificacoes