
"""
Povoamento natural das AÇÕES da biblioteca.
 
Mantém intactos: usuários, leitores, bibliotecários, livros, edições,
exemplares (apenas o campo status é recalculado) e CDD.
 
Recria: notificações, códigos de confirmação, empréstimos e pedidos,
simulando dia a dia os últimos ~75 dias de uso da biblioteca.
 
Uso:
    python manage.py shell < povoar_acoes.py
"""
import random
from datetime import datetime, time, timedelta
 
from django.apps import apps
from django.db import transaction
from django.utils import timezone
 
SEED = 20112026
rng = random.Random(SEED)
 
DIAS_HISTORICO = 75
PRAZO_DIAS = 14
MAX_ATIVOS_POR_LEITOR = 2
 
Pedido = apps.get_model("pedidos", "Pedido")
Emprestimo = apps.get_model("emprestimos", "Emprestimo")
CodigoConfirmacao = apps.get_model("emprestimos", "CodigoConfirmacao")
Notificacao = apps.get_model("notificacoes", "Notificacao")
Leitor = apps.get_model("usuarios", "Leitor")
Edicao = apps.get_model("livros", "Edicao")
Exemplar = apps.get_model("livros", "Exemplar")
 
PENDENTE, APROVADO, RECUSADO, CANCELADO = (
    "pendente", "aprovado", "recusado", "cancelado",
)
DISPONIVEL, RESERVADO, EMPRESTADO, BAIXADO = (
    "disponivel", "reservado", "emprestado", "baixado",
)
 
 
# ---------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------
 
def hora_util(dia, hora_min=8, hora_max=18):
    """Datetime aware em horário comercial, com minutos/segundos variados."""
    momento = datetime.combine(
        dia,
        time(
            hour=rng.randint(hora_min, hora_max),
            minute=rng.randint(0, 59),
            second=rng.randint(0, 59),
            microsecond=rng.randint(0, 999999),
        ),
    )
    return timezone.make_aware(momento)
 
 
def proximo_dia_util(dia):
    while dia.weekday() >= 5:  # sábado/domingo
        dia += timedelta(days=1)
    return dia
 
 
def fmt(data):
    return data.strftime("%d/%m/%Y")
 
 
def titulo_edicao(edicao):
    return edicao.livro.titulo
 
 
def sortear_ponderado(itens, pesos):
    return rng.choices(itens, weights=pesos, k=1)[0]
 
 
# ---------------------------------------------------------------
# Escrita no banco (datas auto_now_add exigem update posterior)
# ---------------------------------------------------------------
 
def notificar(usuario, titulo, mensagem, quando, lida, emprestimo=None):
    n = Notificacao.objects.create(
        usuario=usuario,
        titulo=titulo,
        mensagem=mensagem,
        lida=lida,
        emprestimo=emprestimo,
    )
    Notificacao.objects.filter(pk=n.pk).update(data_criacao=quando)
 
 
def criar_pedido(leitor, edicao, status, data_pedido,
                 exemplar=None, data_resposta=None):
    pedido = Pedido.objects.create(
        leitor=leitor,
        edicao=edicao,
        exemplar=exemplar,
        status=status,
        data_resposta=data_resposta,
    )
    Pedido.objects.filter(pk=pedido.pk).update(data_pedido=data_pedido)
    return pedido
 
 
def criar_emprestimo(pedido, exemplar, retirada, devolucao=None,
                     situacao=None):
    prevista = timezone.localtime(retirada).date() + timedelta(days=PRAZO_DIAS)
    return Emprestimo.objects.create(
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
 
 
# ---------------------------------------------------------------
# Simulação
# ---------------------------------------------------------------
 
@transaction.atomic
def popular():
    agora = timezone.now()
    hoje = timezone.localdate()
 
    leitores = list(Leitor.objects.select_related("usuario").order_by("pk"))
    edicoes = list(Edicao.objects.select_related("livro").order_by("pk"))
 
    if not leitores or not edicoes:
        raise RuntimeError("São necessários leitores e edições cadastrados.")
 
    # --- Limpeza: apenas ações ------------------------------------
    print("Limpando notificações, códigos, empréstimos e pedidos...")
    Notificacao.objects.all().delete()
    CodigoConfirmacao.objects.all().delete()
    Emprestimo.objects.all().delete()
    Pedido.objects.all().delete()
 
    # Exemplares baixados continuam baixados; o resto volta a ficar livre
    Exemplar.objects.exclude(status=BAIXADO).update(status=DISPONIVEL)
 
    # Exemplares livres por edição (estado ao longo da simulação)
    livres = {}
    for ex in Exemplar.objects.filter(status=DISPONIVEL).order_by("pk"):
        livres.setdefault(ex.edicao_id, []).append(ex)
    for lista in livres.values():
        rng.shuffle(lista)
 
    # --- Perfil dos leitores: uns leem muito, outros quase nada ----
    pesos_leitor = {l.pk: rng.choice([0.3, 0.6, 1, 1, 1.5, 2.5]) for l in leitores}
 
    # Edições mais populares recebem mais pedidos
    pesos_edicao = {e.pk: rng.choice([0.5, 1, 1, 2, 3]) for e in edicoes}
 
    ativos = {l.pk: 0 for l in leitores}      # pedidos pendentes/aprovados abertos
    pares_ativos = set()                        # (leitor, edicao) em andamento
 
    # Eventos futuros dentro da simulação: devoluções e retiradas
    # Cada item: dict com estado do pedido em andamento
    em_andamento = []
 
    stats = {
        "pendentes": 0, "aprovados": 0, "recusados": 0, "cancelados": 0,
        "emprestimos": 0, "devolvidos_no_prazo": 0, "devolvidos_atrasados": 0,
        "abertos_em_dia": 0, "abertos_atrasados": 0, "perdidos": 0,
        "aguardando_retirada": 0,
    }
 
    inicio = hoje - timedelta(days=DIAS_HISTORICO)
 
    # --- Fecha pedidos/empréstimos cujos eventos já passaram --------
    def liberar(item):
        ativos[item["leitor"].pk] -= 1
        pares_ativos.discard((item["leitor"].pk, item["edicao"].pk))
 
    def processar_dia(dia):
        """Retiradas, devoluções e avisos que acontecem em `dia`."""
        for item in list(em_andamento):
            leitor, edicao, exemplar = item["leitor"], item["edicao"], item["exemplar"]
            usuario = leitor.usuario
 
            # Retirada na biblioteca
            if item["fase"] == "aguardando" and item["dia_retirada"] <= dia:
                retirada = hora_util(item["dia_retirada"], 9, 17)
                emp = criar_emprestimo(item["pedido"], exemplar, retirada)
                item["emprestimo"] = emp
                item["fase"] = "emprestado"
                item["retirada"] = retirada
                item["prevista"] = timezone.localtime(retirada).date() + timedelta(days=PRAZO_DIAS)
                stats["emprestimos"] += 1
                notificar(
                    usuario,
                    "Empréstimo realizado!",
                    f'O empréstimo do livro "{titulo_edicao(edicao)}" foi registrado '
                    f"com sucesso. A data prevista para devolução é {fmt(item['prevista'])}.",
                    retirada + timedelta(hours=rng.randint(0, 1), minutes=rng.randint(1, 50)),
                    lida=item["retirada"].date() < hoje - timedelta(days=3) or rng.random() < 0.7,
                    emprestimo=emp,
                )
 
            # Devolução
            if item["fase"] == "emprestado" and item["dia_devolucao"] is not None \
                    and item["dia_devolucao"] <= dia:
                emp = item["emprestimo"]
                devolucao = hora_util(item["dia_devolucao"], 9, 17)
                atrasado = item["dia_devolucao"] > item["prevista"]
 
                if item["perdido"]:
                    emp.data_devolucao = devolucao
                    emp.situacao_encerramento = "perdido"
                    emp.save(update_fields=["data_devolucao", "situacao_encerramento"])
                    exemplar.status = BAIXADO
                    exemplar.data_baixa = devolucao
                    exemplar.motivo_baixa = "Livro perdido pelo leitor após o prazo de devolução."
                    exemplar.save(update_fields=["status", "data_baixa", "motivo_baixa"])
                    stats["perdidos"] += 1
                else:
                    emp.data_devolucao = devolucao
                    emp.situacao_encerramento = "devolvido"
                    emp.save(update_fields=["data_devolucao", "situacao_encerramento"])
                    exemplar.status = DISPONIVEL
                    exemplar.save(update_fields=["status"])
                    livres.setdefault(edicao.pk, []).append(exemplar)
                    stats["devolvidos_atrasados" if atrasado else "devolvidos_no_prazo"] += 1
 
                item["fase"] = "encerrado"
                liberar(item)
                em_andamento.remove(item)
 
            # Aviso de vencimento (no dia) e de atraso (um dia depois)
            elif item["fase"] == "emprestado":
                if dia == item["prevista"] - timedelta(days=1) and not item.get("avisou_proximo"):
                    item["avisou_proximo"] = True
                    notificar(
                        usuario,
                        "Devolução próxima!",
                        f'O prazo de devolução do livro "{titulo_edicao(edicao)}" '
                        f"vence amanhã ({fmt(item['prevista'])}).",
                        hora_util(dia, 8, 9),
                        lida=dia < hoje - timedelta(days=2) or rng.random() < 0.5,
                        emprestimo=item["emprestimo"],
                    )
                if dia == item["prevista"] + timedelta(days=1) and not item.get("avisou_atraso"):
                    item["avisou_atraso"] = True
                    notificar(
                        usuario,
                        "Devolução em atraso!",
                        f'O prazo de devolução do livro "{titulo_edicao(edicao)}" '
                        f"venceu em {fmt(item['prevista'])}. Devolva o exemplar o quanto antes.",
                        hora_util(dia, 8, 9),
                        lida=dia < hoje - timedelta(days=4) or rng.random() < 0.4,
                        emprestimo=item["emprestimo"],
                    )
 
    def decidir_devolucao(retirada_dia):
        """Define quando (e se) o leitor devolve. None = ainda não devolveu."""
        prevista = retirada_dia + timedelta(days=PRAZO_DIAS)
        sorteio = rng.random()
        if sorteio < 0.62:            # devolve antes ou no dia
            dev = prevista - timedelta(days=rng.choice([0, 0, 1, 1, 2, 3, 5, 7]))
        elif sorteio < 0.90:          # atrasa alguns dias
            dev = prevista + timedelta(days=rng.randint(1, 9))
        else:                         # sumiço/demora longa
            dev = prevista + timedelta(days=rng.randint(10, 40))
        dev = max(dev, retirada_dia + timedelta(days=1))
        return proximo_dia_util(dev)
 
    dia = inicio
    while dia <= hoje:
        processar_dia(dia)
 
        # Biblioteca tem movimento menor no fim de semana (pedidos online
        # continuam, mas as respostas e retiradas só em dia útil).
        fim_de_semana = dia.weekday() >= 5
        media = 0.5 if fim_de_semana else 1.1
        # Dias mais recentes têm um pouco mais de movimento
        if (hoje - dia).days <= 14:
            media += 0.3
        qtd_pedidos = min(4, int(rng.expovariate(1 / media)))
 
        for _ in range(qtd_pedidos):
            candidatos = [l for l in leitores if ativos[l.pk] < MAX_ATIVOS_POR_LEITOR]
            if not candidatos:
                break
            leitor = sortear_ponderado(candidatos, [pesos_leitor[l.pk] for l in candidatos])
 
            opcoes = [e for e in edicoes if (leitor.pk, e.pk) not in pares_ativos]
            edicao = sortear_ponderado(opcoes, [pesos_edicao[e.pk] for e in opcoes])
 
            data_pedido = hora_util(dia, 7, 22)
            if data_pedido > agora:
                continue
 
            dia_resposta = proximo_dia_util(dia + timedelta(days=rng.choice([0, 0, 1, 1, 2])))
            dia_resposta = max(dia_resposta, dia)
            data_resposta = hora_util(dia_resposta, 9, 17)
            if data_resposta <= data_pedido:
                data_resposta = data_pedido + timedelta(hours=rng.randint(1, 6))
 
            # Pedido ainda sem resposta (só os mais recentes)
            if data_resposta > agora:
                criar_pedido(leitor, edicao, PENDENTE, data_pedido)
                ativos[leitor.pk] += 1
                pares_ativos.add((leitor.pk, edicao.pk))
                stats["pendentes"] += 1
                continue
 
            # Resultado da análise
            sorteio = rng.random()
            exemplares_livres = livres.get(edicao.pk, [])
 
            if sorteio < 0.07:
                # Leitor desiste antes da resposta
                data_cancel = data_pedido + timedelta(hours=rng.randint(1, 30))
                if data_cancel > agora:
                    data_cancel = agora - timedelta(minutes=rng.randint(5, 60))
                criar_pedido(leitor, edicao, CANCELADO, data_pedido,
                             data_resposta=data_cancel)
                stats["cancelados"] += 1
                notificar(
                    leitor.usuario, "Pedido cancelado!",
                    f'Seu pedido do livro "{titulo_edicao(edicao)}" foi cancelado.',
                    data_cancel, lida=True,
                )
                continue
 
            if sorteio < 0.18 or not exemplares_livres:
                # Recusado (pendências ou sem exemplar disponível)
                criar_pedido(leitor, edicao, RECUSADO, data_pedido,
                             data_resposta=data_resposta)
                stats["recusados"] += 1
                notificar(
                    leitor.usuario, "Pedido recusado!",
                    f'Seu pedido do livro "{titulo_edicao(edicao)}" foi recusado. '
                    "Procure a biblioteca para regularizar suas pendências.",
                    data_resposta + timedelta(minutes=rng.randint(1, 20)),
                    lida=data_resposta < agora - timedelta(days=2) or rng.random() < 0.6,
                )
                continue
 
            # Aprovado: separa um exemplar
            exemplar = exemplares_livres.pop()
            pedido = criar_pedido(
                leitor, edicao, APROVADO, data_pedido,
                exemplar=exemplar, data_resposta=data_resposta,
            )
            stats["aprovados"] += 1
            ativos[leitor.pk] += 1
            pares_ativos.add((leitor.pk, edicao.pk))
 
            notificar(
                leitor.usuario, "Reserva aprovada!",
                f'Sua reserva do livro "{titulo_edicao(edicao)}" foi aprovada. '
                "Compareça à biblioteca para retirar o exemplar.",
                data_resposta + timedelta(minutes=rng.randint(1, 20)),
                lida=data_resposta < agora - timedelta(days=2) or rng.random() < 0.6,
            )
 
            # Quando o leitor vai retirar (alguns demoram, poucos nunca vão)
            dia_retirada = proximo_dia_util(
                dia_resposta + timedelta(days=rng.choice([0, 1, 1, 2, 2, 3, 4]))
            )
            em_andamento.append({
                "leitor": leitor, "edicao": edicao, "exemplar": exemplar,
                "pedido": pedido, "fase": "aguardando",
                "dia_retirada": dia_retirada,
                "dia_devolucao": decidir_devolucao(dia_retirada),
                "perdido": False,
            })
            # Perda: só em atrasos muito longos já encerrados
            item = em_andamento[-1]
            if item["dia_devolucao"] > dia_retirada + timedelta(days=PRAZO_DIAS + 25) \
                    and item["dia_devolucao"] <= hoje:
                item["perdido"] = True
 
        dia += timedelta(days=1)
 
    # Processa o último dia de novo para eventos que cairiam "hoje"
    processar_dia(hoje)
 
    # Itens que ficaram em andamento: definem o estado final dos exemplares
    # (devoluções planejadas para depois de hoje não aconteceram ainda)
    for item in em_andamento:
        exemplar = item["exemplar"]
        if item["fase"] == "aguardando":
            exemplar.status = RESERVADO
            stats["aguardando_retirada"] += 1
        elif item["fase"] == "emprestado":
            exemplar.status = EMPRESTADO
            if item["prevista"] < hoje:
                stats["abertos_atrasados"] += 1
            else:
                stats["abertos_em_dia"] += 1
        exemplar.save(update_fields=["status"])
 
    # Empréstimos "emprestados" cuja devolução planejada é futura
    # permanecem em aberto (data_devolucao nula), o que é o esperado.
 
    # --- Conferência ---------------------------------------------
    for l in leitores:
        if ativos[l.pk] > MAX_ATIVOS_POR_LEITOR or ativos[l.pk] < 0:
            raise RuntimeError(f"Leitor {l.pk} com contagem de ativos inválida.")
 
    print("\n" + "=" * 45)
    print("POVOAMENTO NATURAL CONCLUÍDO")
    print("=" * 45)
    print(f"\nPeríodo simulado: {fmt(inicio)} a {fmt(hoje)}")
    print("\nPedidos:")
    print(f"  Pendentes:  {stats['pendentes']}")
    print(f"  Aprovados:  {stats['aprovados']}")
    print(f"  Recusados:  {stats['recusados']}")
    print(f"  Cancelados: {stats['cancelados']}")
    print(f"  Total:      {Pedido.objects.count()}")
    print("\nEmpréstimos:")
    print(f"  Total:                 {Emprestimo.objects.count()}")
    print(f"  Devolvidos no prazo:   {stats['devolvidos_no_prazo']}")
    print(f"  Devolvidos com atraso: {stats['devolvidos_atrasados']}")
    print(f"  Perdidos:              {stats['perdidos']}")
    print(f"  Em aberto e em dia:    {stats['abertos_em_dia']}")
    print(f"  Em aberto e atrasados: {stats['abertos_atrasados']}")
    print(f"  Aprovados aguardando retirada: {stats['aguardando_retirada']}")
    print(f"\nNotificações geradas: {Notificacao.objects.count()}")
    print("\nExemplares:")
    for status in (DISPONIVEL, RESERVADO, EMPRESTADO, BAIXADO):
        print(f"  {status}: {Exemplar.objects.filter(status=status).count()}")
 
 
popular()
 