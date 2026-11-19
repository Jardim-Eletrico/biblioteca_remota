
import random
from datetime import datetime, time, timedelta

from django.apps import apps
from django.db import transaction
from django.utils import timezone


SEED = 19112026
random.seed(SEED)

Pedido = apps.get_model("pedidos", "Pedido")
Emprestimo = apps.get_model("emprestimos", "Emprestimo")
Leitor = apps.get_model("usuarios", "Leitor")
Edicao = apps.get_model("livros", "Edicao")
Exemplar = apps.get_model("livros", "Exemplar")

PENDENTE = "pendente"
APROVADO = "aprovado"
RECUSADO = "recusado"
CANCELADO = "cancelado"

DISPONIVEL = "disponivel"
RESERVADO = "reservado"
EMPRESTADO = "emprestado"

PRAZO_DIAS = 14


def momento_no_dia(data, hora=15):
    return timezone.make_aware(
        datetime.combine(data, time(hour=hora))
    )


def criar_pedido(leitor, edicao, status, data_pedido,
                 exemplar=None, data_resposta=None):

    pedido = Pedido.objects.create(
        leitor=leitor,
        edicao=edicao,
        exemplar=exemplar,
        status=status,
        data_resposta=data_resposta,
    )

    # data_pedido pode possuir auto_now_add.
    # Por isso, atualizamos o valor diretamente no banco.
    Pedido.objects.filter(pk=pedido.pk).update(
        data_pedido=data_pedido
    )

    return pedido


def criar_emprestimo(pedido, exemplar, retirada,
                     devolucao=None):

    prevista = (
        timezone.localtime(retirada).date()
        + timedelta(days=PRAZO_DIAS)
    )

    situacao = "devolvido" if devolucao else None

    emprestimo = Emprestimo.objects.create(
        pedido=pedido,
        exemplar=exemplar,
        data_retirada=retirada,
        data_prevista_devolucao=prevista,
        data_devolucao=devolucao,
        situacao_encerramento=situacao,
        regularizado=False,
        data_regularizacao=None,
        motivo_regularizacao="",
    )

    if devolucao:
        exemplar.status = DISPONIVEL
    else:
        exemplar.status = EMPRESTADO

    exemplar.save(update_fields=["status"])

    return emprestimo


def data_pedido_antes_da_retirada(retirada):
    return retirada - timedelta(
        days=random.randint(2, 4),
        hours=random.randint(1, 12),
    )


def escolher_par_ativo(leitores, edicoes, ativos, pares):
    opcoes = [
        (leitor, edicao)
        for leitor in leitores
        for edicao in edicoes
        if ativos[leitor.pk] < 2
        and (leitor.pk, edicao.pk) not in pares
    ]

    if not opcoes:
        raise RuntimeError(
            "Não foi possível encontrar leitor e edição "
            "para um novo pedido ativo."
        )

    return random.choice(opcoes)


def escolher_leitor_para_exemplar(
    leitores,
    exemplar,
    ativos,
    pares,
    leitor_obrigatorio=None,
):
    candidatos = leitores

    if leitor_obrigatorio is not None:
        candidatos = [
            leitor for leitor in leitores
            if leitor.pk == leitor_obrigatorio
        ]

    candidatos = [
        leitor for leitor in candidatos
        if ativos[leitor.pk] < 2
        and (leitor.pk, exemplar.edicao_id) not in pares
    ]

    if not candidatos:
        raise RuntimeError(
            f"Não foi possível associar um leitor ao exemplar "
            f"{exemplar.pk}."
        )

    return random.choice(candidatos)


@transaction.atomic
def popular():

    agora = timezone.now()
    hoje = timezone.localdate()

    leitores = list(Leitor.objects.select_related("usuario").order_by("pk"))
    edicoes = list(Edicao.objects.all().order_by("pk"))

    if not leitores or not edicoes:
        raise RuntimeError(
            "O banco precisa possuir leitores e edições cadastrados."
        )

    carolina = next(
        (leitor for leitor in leitores if leitor.pk == 3),
        None,
    )

    if carolina is None or carolina.usuario.nome != "Carolina Santos":
        raise RuntimeError(
            "Não encontrei Carolina Santos com ID 3. "
            "Nenhum dado foi alterado."
        )

    # Verifica a quantidade de exemplares que poderá ser utilizada.
    exemplares_possiveis = Exemplar.objects.filter(
        status__in=[DISPONIVEL, RESERVADO, EMPRESTADO]
    ).count()

    if exemplares_possiveis < 12:
        raise RuntimeError(
            f"São necessários pelo menos 12 exemplares utilizáveis. "
            f"Foram encontrados {exemplares_possiveis}."
        )

    # -----------------------------------------------------
    # 1. LIMPEZA DOS DADOS ANTERIORES
    # -----------------------------------------------------

    print("Removendo empréstimos anteriores...")
    Emprestimo.objects.all().delete()

    print("Removendo pedidos anteriores...")
    Pedido.objects.all().delete()

    # Libera exemplares que estavam reservados ou emprestados.
    # Exemplares baixados e indisponíveis são preservados.
    Exemplar.objects.filter(
        status__in=[RESERVADO, EMPRESTADO]
    ).update(status=DISPONIVEL)

    exemplares = list(
        Exemplar.objects.filter(
            status=DISPONIVEL
        ).select_related("edicao").order_by("pk")
    )

    random.shuffle(exemplares)

    ativos = {leitor.pk: 0 for leitor in leitores}
    pares_ativos = set()

    criados = {
        "pendentes": 0,
        "aprovados": 0,
        "recusados": 0,
        "cancelados": 0,
        "emprestimos": 0,
        "devolvidos_no_prazo": 0,
        "devolvidos_com_atraso": 0,
        "abertos_em_dia": 0,
        "abertos_atrasados": 0,
        "aguardando_retirada": 0,
    }

    # -----------------------------------------------------
    # 2. EMPRÉSTIMO ATRASADO DA CAROLINA SANTOS
    # -----------------------------------------------------

    exemplar = exemplares.pop()

    retirada = agora - timedelta(days=30)
    prevista = (
        timezone.localtime(retirada).date()
        + timedelta(days=PRAZO_DIAS)
    )

    pedido_data = data_pedido_antes_da_retirada(retirada)

    pedido = criar_pedido(
        leitor=carolina,
        edicao=exemplar.edicao,
        status=APROVADO,
        data_pedido=pedido_data,
        exemplar=exemplar,
        data_resposta=pedido_data + timedelta(hours=5),
    )

    criar_emprestimo(
        pedido=pedido,
        exemplar=exemplar,
        retirada=retirada,
    )

    ativos[carolina.pk] += 1
    pares_ativos.add((carolina.pk, exemplar.edicao_id))

    criados["aprovados"] += 1
    criados["emprestimos"] += 1
    criados["abertos_atrasados"] += 1

    # -----------------------------------------------------
    # 3. EMPRÉSTIMO EM ABERTO E EM DIA
    # -----------------------------------------------------

    exemplar = exemplares.pop()

    leitor = escolher_leitor_para_exemplar(
        leitores, exemplar, ativos, pares_ativos
    )

    retirada = agora - timedelta(days=7)
    pedido_data = data_pedido_antes_da_retirada(retirada)

    pedido = criar_pedido(
        leitor=leitor,
        edicao=exemplar.edicao,
        status=APROVADO,
        data_pedido=pedido_data,
        exemplar=exemplar,
        data_resposta=pedido_data + timedelta(hours=4),
    )

    criar_emprestimo(
        pedido=pedido,
        exemplar=exemplar,
        retirada=retirada,
    )

    ativos[leitor.pk] += 1
    pares_ativos.add((leitor.pk, exemplar.edicao_id))

    criados["aprovados"] += 1
    criados["emprestimos"] += 1
    criados["abertos_em_dia"] += 1

    # -----------------------------------------------------
    # 4. SEIS EMPRÉSTIMOS DEVOLVIDOS
    # -----------------------------------------------------

    for indice in range(6):
        exemplar = exemplares.pop()
        leitor = random.choice(leitores)

        dias_retirada = random.randint(35, 60)
        retirada = agora - timedelta(days=dias_retirada)

        prevista = (
            timezone.localtime(retirada).date()
            + timedelta(days=PRAZO_DIAS)
        )

        if indice < 4:
            # Devolvidos antes do vencimento.
            data_devolucao = momento_no_dia(
                prevista - timedelta(days=random.randint(1, 5))
            )
            criados["devolvidos_no_prazo"] += 1
        else:
            # Devolvidos depois do vencimento.
            data_devolucao = momento_no_dia(
                prevista + timedelta(days=random.randint(1, 6))
            )
            criados["devolvidos_com_atraso"] += 1

        pedido_data = data_pedido_antes_da_retirada(retirada)

        pedido = criar_pedido(
            leitor=leitor,
            edicao=exemplar.edicao,
            status=APROVADO,
            data_pedido=pedido_data,
            exemplar=exemplar,
            data_resposta=pedido_data + timedelta(hours=6),
        )

        criar_emprestimo(
            pedido=pedido,
            exemplar=exemplar,
            retirada=retirada,
            devolucao=data_devolucao,
        )

        criados["aprovados"] += 1
        criados["emprestimos"] += 1

    # -----------------------------------------------------
    # 5. QUATRO PEDIDOS APROVADOS AGUARDANDO RETIRADA
    # -----------------------------------------------------

    for _ in range(4):
        exemplar = exemplares.pop()

        leitor = escolher_leitor_para_exemplar(
            leitores, exemplar, ativos, pares_ativos
        )

        data_pedido = agora - timedelta(
            days=random.randint(2, 15)
        )

        pedido = criar_pedido(
            leitor=leitor,
            edicao=exemplar.edicao,
            status=APROVADO,
            data_pedido=data_pedido,
            exemplar=exemplar,
            data_resposta=data_pedido + timedelta(hours=5),
        )

        exemplar.status = RESERVADO
        exemplar.save(update_fields=["status"])

        ativos[leitor.pk] += 1
        pares_ativos.add((leitor.pk, exemplar.edicao_id))

        criados["aprovados"] += 1
        criados["aguardando_retirada"] += 1

    # -----------------------------------------------------
    # 6. SETE PEDIDOS PENDENTES
    # -----------------------------------------------------

    for _ in range(7):
        leitor, edicao = escolher_par_ativo(
            leitores,
            edicoes,
            ativos,
            pares_ativos,
        )

        data_pedido = agora - timedelta(
            days=random.randint(1, 12)
        )

        criar_pedido(
            leitor=leitor,
            edicao=edicao,
            status=PENDENTE,
            data_pedido=data_pedido,
            exemplar=None,
            data_resposta=None,
        )

        ativos[leitor.pk] += 1
        pares_ativos.add((leitor.pk, edicao.pk))

        criados["pendentes"] += 1

    # -----------------------------------------------------
    # 7. CINCO PEDIDOS RECUSADOS
    # -----------------------------------------------------

    for _ in range(5):
        leitor = random.choice(leitores)
        edicao = random.choice(edicoes)

        data_pedido = agora - timedelta(
            days=random.randint(15, 65)
        )

        criar_pedido(
            leitor=leitor,
            edicao=edicao,
            status=RECUSADO,
            data_pedido=data_pedido,
            data_resposta=data_pedido + timedelta(hours=8),
        )

        criados["recusados"] += 1

    # -----------------------------------------------------
    # 8. QUATRO PEDIDOS CANCELADOS
    # -----------------------------------------------------

    for _ in range(4):
        leitor = random.choice(leitores)
        edicao = random.choice(edicoes)

        data_pedido = agora - timedelta(
            days=random.randint(10, 60)
        )

        criar_pedido(
            leitor=leitor,
            edicao=edicao,
            status=CANCELADO,
            data_pedido=data_pedido,
            data_resposta=data_pedido + timedelta(hours=5),
        )

        criados["cancelados"] += 1

    # -----------------------------------------------------
    # 9. CONFERÊNCIA FINAL
    # -----------------------------------------------------

    total_pedidos = Pedido.objects.count()
    total_emprestimos = Emprestimo.objects.count()

    if total_pedidos != 28 or total_emprestimos != 8:
        raise RuntimeError(
            "A quantidade final de registros não corresponde "
            "ao esperado. A transação será desfeita."
        )

    # Confirma que Carolina possui um empréstimo atrasado em aberto.
    emprestimo_carolina = Emprestimo.objects.filter(
        pedido__leitor=carolina,
        data_devolucao__isnull=True,
        data_prevista_devolucao__lt=hoje,
    ).exists()

    if not emprestimo_carolina:
        raise RuntimeError(
            "O empréstimo atrasado da Carolina não foi criado corretamente."
        )

    print("\n" + "=" * 45)
    print("POPULAÇÃO CONCLUÍDA")
    print("=" * 45)

    print("\nPedidos:")
    print(f"  Pendentes: {criados['pendentes']}")
    print(f"  Aprovados: {criados['aprovados']}")
    print(f"  Recusados: {criados['recusados']}")
    print(f"  Cancelados: {criados['cancelados']}")
    print(f"  Total: {total_pedidos}")

    print("\nEmpréstimos:")
    print(f"  Total: {total_emprestimos}")
    print(f"  Devolvidos no prazo: {criados['devolvidos_no_prazo']}")
    print(f"  Devolvidos com atraso: {criados['devolvidos_com_atraso']}")
    print(f"  Em aberto e em dia: {criados['abertos_em_dia']}")
    print(f"  Em aberto e atrasados: {criados['abertos_atrasados']}")

    print("\nPedidos aprovados aguardando retirada:")
    print(f"  {criados['aguardando_retirada']}")

    print("\nCarolina Santos:")
    print("  Leitora ID: 3")
    print("  Possui empréstimo atrasado em aberto: SIM")

    print("\nExemplares:")
    for status in (
        DISPONIVEL,
        RESERVADO,
        EMPRESTADO,
        "indisponivel",
        "baixado",
    ):
        quantidade = Exemplar.objects.filter(status=status).count()
        print(f"  {status}: {quantidade}")


popular()
