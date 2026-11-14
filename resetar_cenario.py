#!/usr/bin/env python
"""
resetar_cenario.py
==================
Limpa TODA a movimentação da biblioteca (pedidos, empréstimos, códigos de
confirmação e notificações) e gera um cenário novo, com situações naturais:

  * empréstimos devolvidos no prazo e devolvidos com atraso (histórico)
  * empréstimos em andamento (alguns vencendo hoje/amanhã)
  * empréstimos atrasados (de 2 a ~30 dias)
  * livro perdido (pendente) e livro perdido que foi encontrado (regularizado)
  * pedidos pendentes (para o bibliotecário aprovar), inclusive fila para
    edições com um único exemplar já emprestado
  * pedidos aprovados aguardando retirada, recusados e cancelados
  * notificações coerentes com cada situação

NÃO mexe em: usuários (senhas/credenciais), leitores, bibliotecários, livros,
CDDs, edições, exemplares (só o status deles), avaliações, lista de desejos,
tokens JWT e log do admin.

Como rodar (na pasta do projeto, onde fica o manage.py):

    python resetar_cenario.py                # pede confirmação, faz backup do sqlite
    python resetar_cenario.py --dry-run      # simula tudo e desfaz no final
    python resetar_cenario.py --yes          # sem pedir confirmação
    python resetar_cenario.py --seed 42      # cenário reproduzível

Se o módulo de settings não for detectado automaticamente:

    python resetar_cenario.py --settings meuprojeto.settings
"""
import argparse
import os
import random
import re
import shutil
import sys
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path

# ----------------------------------------------------------------------------
# Configurações do cenário (ajuste à vontade)
# ----------------------------------------------------------------------------
PRAZO_DIAS = 14                      # prazo padrão de devolução (igual ao banco atual)
NOTIFICACOES_EXTRAS = True           # avisos de atraso / vencimento / pedido recusado
RESTAURAR_BAIXAS_DE_EMPRESTIMOS = True  # exemplares baixados por "perdido" voltam a disponível
HORA_INICIO, HORA_FIM = 8, 17        # horário de funcionamento (para datas realistas)


# ----------------------------------------------------------------------------
# Bootstrap do Django
# ----------------------------------------------------------------------------
def _detectar_settings():
    if os.environ.get("DJANGO_SETTINGS_MODULE"):
        return os.environ["DJANGO_SETTINGS_MODULE"]
    manage = Path.cwd() / "manage.py"
    if manage.exists():
        m = re.search(
            r"setdefault\(\s*['\"]DJANGO_SETTINGS_MODULE['\"]\s*,\s*['\"]([\w.]+)['\"]",
            manage.read_text(encoding="utf-8"),
        )
        if m:
            return m.group(1)
    return None


def _iniciar_django(settings_arg=None):
    sys.path.insert(0, str(Path.cwd()))
    modulo = settings_arg or _detectar_settings()
    if not modulo:
        sys.exit(
            "Não consegui descobrir o módulo de settings. Rode na pasta do "
            "manage.py ou use --settings meuprojeto.settings"
        )
    os.environ["DJANGO_SETTINGS_MODULE"] = modulo
    import django

    django.setup()


# ----------------------------------------------------------------------------
# Utilidades
# ----------------------------------------------------------------------------
class DryRun(Exception):
    """Usada só para desfazer a transação no --dry-run."""


def escolher_valor(model, campo, candidatos, obrigatorio=True):
    """Devolve o primeiro valor de `candidatos` aceito pelas choices do campo."""
    choices = model._meta.get_field(campo).choices
    if not choices:  # campo sem choices: aceita o primeiro candidato
        return candidatos[0]
    validos = {c[0] for c in choices}
    for c in candidatos:
        if c in validos:
            return c
    if obrigatorio:
        sys.exit(
            f"{model.__name__}.{campo}: nenhum de {candidatos} está nas choices "
            f"{sorted(validos)}. Ajuste o script."
        )
    return None


def criar(model, datas=None, **kwargs):
    """
    Cria sem chamar save()/signals (bulk_create) para não disparar notificações
    ou regras automáticas do app, e depois força as datas com update() (que
    ignora auto_now/auto_now_add).
    """
    obj = model(**kwargs)
    model.objects.bulk_create([obj])
    if obj.pk is None:
        sys.exit("bulk_create não devolveu a PK (requer Django >= 4 e SQLite >= 3.35).")
    if datas:
        model.objects.filter(pk=obj.pk).update(**datas)
        for k, v in datas.items():
            setattr(obj, k, v)
    return obj


def fmt(d):
    return d.strftime("%d/%m/%Y")


# ----------------------------------------------------------------------------
# Principal
# ----------------------------------------------------------------------------
def executar(args):
    from django.apps import apps
    from django.conf import settings
    from django.db import connection, transaction
    from django.utils import timezone

    Usuario = apps.get_model("usuarios", "Usuario")
    Leitor = apps.get_model("usuarios", "Leitor")
    Livro = apps.get_model("livros", "Livro")
    Edicao = apps.get_model("livros", "Edicao")
    Exemplar = apps.get_model("livros", "Exemplar")
    Pedido = apps.get_model("pedidos", "Pedido")
    Emprestimo = apps.get_model("emprestimos", "Emprestimo")
    CodigoConfirmacao = apps.get_model("emprestimos", "CodigoConfirmacao")
    Notificacao = apps.get_model("notificacoes", "Notificacao")

    seed = args.seed if args.seed is not None else random.randrange(1, 10**6)
    rng = random.Random(seed)

    # --- valores de status aceitos pelo seu models.py -----------------------
    P_PEND = escolher_valor(Pedido, "status", ["pendente", "aguardando", "solicitado"])
    P_APROV = escolher_valor(Pedido, "status", ["aprovado"])
    P_RECUS = escolher_valor(Pedido, "status", ["recusado", "rejeitado"])
    P_CANC = escolher_valor(Pedido, "status", ["cancelado"])
    E_DISP = escolher_valor(Exemplar, "status", ["disponivel"])
    E_EMPR = escolher_valor(Exemplar, "status", ["emprestado"])
    E_BAIX = escolher_valor(Exemplar, "status", ["baixado"])
    E_RESERV = escolher_valor(Exemplar, "status", ["reservado"], obrigatorio=False) or E_DISP
    S_DEV = escolher_valor(Emprestimo, "situacao_encerramento", ["devolvido"])
    S_PERD = escolher_valor(Emprestimo, "situacao_encerramento", ["perdido"])

    # --- backup (sqlite) -----------------------------------------------------
    db = settings.DATABASES["default"]
    if connection.vendor == "sqlite" and not args.sem_backup and not args.dry_run:
        origem = Path(str(db["NAME"]))
        if origem.exists():
            destino = origem.with_name(f"{origem.name}.bak-{datetime.now():%Y%m%d-%H%M%S}")
            shutil.copy2(origem, destino)
            print(f"Backup criado: {destino}")

    if not args.yes and not args.dry_run:
        print("\nISSO APAGA todos os pedidos, empréstimos, códigos de confirmação")
        print("e notificações do banco:", db["NAME"])
        if input("Digite LIMPAR para continuar: ").strip() != "LIMPAR":
            sys.exit("Cancelado.")

    # --- agora / helpers de data --------------------------------------------
    usar_tz = settings.USE_TZ
    agora = timezone.localtime() if usar_tz else datetime.now()

    def quando(dias_atras, hora=None):
        base = agora - timedelta(days=dias_atras)
        h = hora if hora is not None else rng.randint(HORA_INICIO, HORA_FIM)
        dt = base.replace(hour=h, minute=rng.randint(0, 59),
                          second=rng.randint(0, 59), microsecond=rng.randint(0, 999999))
        return min(dt, agora - timedelta(minutes=rng.randint(5, 40)))

    def limitar(dt):
        return min(dt, agora - timedelta(minutes=rng.randint(1, 4)))

    # ========================================================================
    with transaction.atomic():
        antes = {
            "usuarios": Usuario.objects.count(),
            "leitores": Leitor.objects.count(),
            "livros": Livro.objects.count(),
            "edicoes": Edicao.objects.count(),
            "exemplares": Exemplar.objects.count(),
        }
        removidos = {
            "notificacoes": Notificacao.objects.count(),
            "codigos": CodigoConfirmacao.objects.count(),
            "emprestimos": Emprestimo.objects.count(),
            "pedidos": Pedido.objects.count(),
        }

        # ---------------- 1) LIMPEZA -----------------------------------------
        ids_perdidos = list(
            Emprestimo.objects.filter(situacao_encerramento=S_PERD)
            .values_list("exemplar_id", flat=True)
        )
        Notificacao.objects.all().delete()
        CodigoConfirmacao.objects.all().delete()
        Emprestimo.objects.all().delete()
        Pedido.objects.all().delete()

        if connection.vendor == "sqlite":  # IDs recomeçam do 1
            tabelas = [m._meta.db_table for m in (Notificacao, CodigoConfirmacao, Emprestimo, Pedido)]
            with connection.cursor() as cur:
                cur.execute(
                    "DELETE FROM sqlite_sequence WHERE name IN (%s)" % ",".join(["%s"] * len(tabelas)),
                    tabelas,
                )

        # exemplares: tudo que estava preso a empréstimo/reserva volta a disponível
        Exemplar.objects.filter(status__in=[E_EMPR, E_RESERV]).update(status=E_DISP)
        if RESTAURAR_BAIXAS_DE_EMPRESTIMOS and ids_perdidos:
            Exemplar.objects.filter(pk__in=ids_perdidos, status=E_BAIX).update(
                status=E_DISP, data_baixa=None, motivo_baixa=None
            )

        # ---------------- 2) DADOS BASE ---------------------------------------
        leitores = list(Leitor.objects.select_related("usuario"))
        if len(leitores) < 8:
            sys.exit("São necessários pelo menos 8 leitores para montar o cenário.")

        exemplares_livres = {}
        for ex in Exemplar.objects.filter(status=E_DISP).order_by("id"):
            exemplares_livres.setdefault(ex.edicao_id, []).append(ex)
        edicoes = [e for e in Edicao.objects.select_related("livro").order_by("id")
                   if exemplares_livres.get(e.id)]
        if len(edicoes) < 4:
            sys.exit("São necessárias pelo menos 4 edições com exemplares.")
        for lst in exemplares_livres.values():
            rng.shuffle(lst)

        por_copias = sorted(edicoes, key=lambda e: len(exemplares_livres[e.id]))
        unica_a, unica_b = por_copias[0], por_copias[1]  # edições com menos exemplares

        # ocupação de exemplares (para não sobrepor empréstimos no tempo)
        INF = agora + timedelta(days=3650)
        ocupacao = {}   # exemplar_id -> [(ini, fim)]
        usos = {}       # exemplar_id -> nº de usos

        def livre(ex, ini, fim):
            return all(fim <= i or ini >= f for i, f in ocupacao.get(ex.id, []))

        def alocar(edicao, ini, fim):
            cands = sorted(exemplares_livres[edicao.id], key=lambda e: usos.get(e.id, 0))
            for ex in cands:
                if livre(ex, ini, fim):
                    ocupacao.setdefault(ex.id, []).append((ini, fim))
                    usos[ex.id] = usos.get(ex.id, 0) + 1
                    return ex
            return None

        def alocar_qualquer(ini, fim, preferida=None, evitar=()):
            tentativas = [preferida] if preferida else []
            outras = [e for e in edicoes if e.id not in evitar and e is not preferida]
            rng.shuffle(outras)
            for ed in tentativas + outras:
                ex = alocar(ed, ini, fim)
                if ex:
                    return ed, ex
            return None, None

        # controle por leitor
        peso = {l.id: rng.choice([1, 1, 2, 3, 4]) for l in leitores}  # uns leem mais que outros
        ativos = {l.id: 0 for l in leitores}
        edicoes_ativas = {l.id: set() for l in leitores}
        com_atraso = set()

        def escolher_leitor(max_ativos=2, sem_atraso=False, edicao=None, entre=None):
            pool = [l for l in (entre or leitores)
                    if ativos[l.id] < max_ativos
                    and not (sem_atraso and l.id in com_atraso)
                    and not (edicao and edicao.id in edicoes_ativas[l.id])]
            if not pool:
                pool = [l for l in (entre or leitores) if not (edicao and edicao.id in edicoes_ativas[l.id])]
            return rng.choices(pool, weights=[peso[l.id] for l in pool])[0]

        specs = []  # um dict por pedido

        # ---------------- 3) CONSTRUÇÃO DO CENÁRIO ----------------------------
        def spec_emprestimo(dias_retirada, *, edicao=None, tipo, dias_ate_devolver=None,
                            atraso_dias=None, leitor=None):
            """
            tipo: 'devolvido' | 'ativo' | 'perdido' | 'perdido_regularizado'
            """
            T = quando(dias_retirada)                                   # retirada
            R = limitar(T - timedelta(hours=rng.randint(2, 30)))        # aprovação
            P = R - timedelta(minutes=rng.randint(20, 600))             # pedido
            prevista = (T + timedelta(days=PRAZO_DIAS)).date()
            fim_prazo = T.replace(hour=17, minute=30) + timedelta(days=PRAZO_DIAS)

            D = None            # devolução / encerramento
            situacao = None
            if tipo == "devolvido":
                if atraso_dias:
                    D = fim_prazo + timedelta(days=atraso_dias) - timedelta(hours=rng.randint(0, 6))
                else:
                    D = T + timedelta(days=dias_ate_devolver)
                D = limitar(D)
                situacao = S_DEV
            elif tipo in ("perdido", "perdido_regularizado"):
                D = limitar(fim_prazo + timedelta(days=atraso_dias))   # baixa registrada
                situacao = S_PERD

            reg = None
            if tipo == "perdido_regularizado":
                reg = limitar(D + timedelta(days=rng.randint(5, 12)))

            fim_ocup = INF if tipo in ("ativo", "perdido") else (reg or D)
            if edicao is not None:
                ex = alocar(edicao, R, fim_ocup)
                ed = edicao if ex else None
            else:
                ed, ex = (None, None)
            if ex is None:
                ed, ex = alocar_qualquer(R, fim_ocup, preferida=edicao)
            if ex is None:
                return None

            if leitor is None:
                leitor = escolher_leitor(
                    max_ativos=2 if tipo == "ativo" else 99, edicao=ed if tipo == "ativo" else None)
            if tipo == "ativo":
                ativos[leitor.id] += 1
                edicoes_ativas[leitor.id].add(ed.id)
                if prevista < agora.date():
                    com_atraso.add(leitor.id)
            if tipo in ("perdido",):
                com_atraso.add(leitor.id)

            s = dict(
                tipo=tipo, leitor=leitor, edicao=ed, exemplar=ex,
                status=P_APROV, data_pedido=P, data_resposta=R,
                emprestimo=dict(retirada=T, prevista=prevista, devolucao=D,
                                situacao=situacao, regularizado=(tipo == "perdido_regularizado"),
                                data_reg=reg),
                exemplar_final=(E_EMPR if tipo == "ativo"
                                else E_BAIX if tipo == "perdido" else E_DISP),
            )
            specs.append(s)
            return s

        # 3.1 perdidos
        spec_emprestimo(58, tipo="perdido", atraso_dias=20)
        spec_emprestimo(47, tipo="perdido_regularizado", atraso_dias=15)

        # 3.2 atrasados (ainda não devolvidos)
        for i, d in enumerate([16, 18, 21, 24, 29, 38]):
            spec_emprestimo(d, tipo="ativo", edicao=unica_b if i == 3 else None)

        # 3.3 em andamento (13 = vence amanhã, 14 = vence hoje)
        for i, d in enumerate([14, 13, 13, 1, 3, 5, 7, 9]):
            spec_emprestimo(d, tipo="ativo", edicao=unica_a if d == 3 else None)

        # 3.4 histórico: devolvidos no prazo
        for _ in range(14):
            spec_emprestimo(rng.randint(16, 70), tipo="devolvido",
                            dias_ate_devolver=rng.randint(2, 13))

        # 3.5 histórico: devolvidos com atraso
        for _ in range(5):
            spec_emprestimo(rng.randint(28, 62), tipo="devolvido", atraso_dias=rng.randint(2, 10))

        emprestimos_specs = [s for s in specs if s["emprestimo"]]
        leitores_atrasados = [s["leitor"] for s in emprestimos_specs
                              if s["tipo"] in ("ativo", "perdido")
                              and s["emprestimo"]["prevista"] < agora.date()]

        # 3.6 pedidos pendentes (a aprovar)
        pendentes_cfg = [(0, unica_a), (0, unica_b), (0, None), (1, None), (2, None), (4, None)]
        pend_pares = set()
        for dias, ed_pref in pendentes_cfg:
            P = quando(dias, hora=rng.randint(HORA_INICIO, HORA_FIM))
            ed = ed_pref or rng.choice(edicoes)
            lei = escolher_leitor(sem_atraso=True, edicao=ed)
            if (lei.id, ed.id) in pend_pares:
                continue
            pend_pares.add((lei.id, ed.id))
            specs.append(dict(tipo="pendente", leitor=lei, edicao=ed, exemplar=None,
                              status=P_PEND, data_pedido=P, data_resposta=None, emprestimo=None))

        # 3.7 aprovados, aguardando retirada
        for horas in (5, 26, 50):
            R = limitar(agora - timedelta(hours=horas))
            P = R - timedelta(minutes=rng.randint(30, 400))
            ed, ex = alocar_qualquer(R, INF)
            if not ex:
                continue
            lei = escolher_leitor(sem_atraso=True, edicao=ed)
            specs.append(dict(tipo="aguardando_retirada", leitor=lei, edicao=ed, exemplar=ex,
                              status=P_APROV, data_pedido=P, data_resposta=R, emprestimo=None,
                              exemplar_final=E_RESERV))

        # 3.8 recusados (leitores com pendência: atraso ou livro perdido)
        candidatos = list({l.id: l for l in leitores_atrasados}.values())
        rng.shuffle(candidatos)
        for lei in candidatos[:3]:
            P = quando(rng.randint(1, 8))
            R = limitar(P + timedelta(hours=rng.randint(1, 20)))
            ed = rng.choice(edicoes)
            specs.append(dict(tipo="recusado", leitor=lei, edicao=ed, exemplar=None,
                              status=P_RECUS, data_pedido=P, data_resposta=R, emprestimo=None))

        # 3.9 cancelados pelo próprio leitor
        for dias in (2, 6, 12):
            P = quando(dias)
            R = limitar(P + timedelta(hours=rng.randint(1, 30)))
            ed = rng.choice(edicoes)
            lei = escolher_leitor(max_ativos=99, edicao=None)
            specs.append(dict(tipo="cancelado", leitor=lei, edicao=ed, exemplar=None,
                              status=P_CANC, data_pedido=P, data_resposta=R, emprestimo=None))

        # ---------------- 4) NOTIFICAÇÕES (rascunho) --------------------------
        notifs = []

        def notificar(spec, titulo, msg, data, lida, com_emprestimo=False):
            notifs.append(dict(spec=spec, titulo=titulo, mensagem=msg, data=limitar(data),
                               lida=lida, com_emprestimo=com_emprestimo))

        def lida_por_idade(data, base=0.85):
            dias = (agora - data).total_seconds() / 86400
            return rng.random() < (base if dias > 7 else 0.5 if dias > 2 else 0.1)

        for s in specs:
            titulo_livro = s["edicao"].livro.titulo
            e = s["emprestimo"]
            if s["tipo"] in ("pendente",):
                continue
            if s["tipo"] == "recusado":
                if NOTIFICACOES_EXTRAS:
                    notificar(s, "Pedido recusado!",
                              f'Seu pedido do livro "{titulo_livro}" foi recusado. '
                              "Procure a biblioteca para regularizar suas pendências.",
                              s["data_resposta"], lida_por_idade(s["data_resposta"]))
                continue
            if s["tipo"] == "cancelado":
                notificar(s, "Pedido cancelado!", f'Seu pedido do livro "{titulo_livro}" foi cancelado.',
                          s["data_resposta"], lida_por_idade(s["data_resposta"]))
                continue

            # aprovado (aguardando retirada ou emprestado)
            notificar(s, "Reserva aprovada!",
                      f'Sua reserva do livro "{titulo_livro}" foi aprovada. '
                      "Compareça à biblioteca para retirar o exemplar.",
                      s["data_resposta"], lida_por_idade(s["data_resposta"]))
            if not e:
                continue
            notificar(s, "Empréstimo realizado!",
                      f'O empréstimo do livro "{titulo_livro}" foi registrado com sucesso. '
                      f'A data prevista para devolução é {fmt(e["prevista"])}.',
                      e["retirada"], lida_por_idade(e["retirada"]), com_emprestimo=True)

            if not NOTIFICACOES_EXTRAS:
                continue
            prevista_dt = datetime.combine(e["prevista"], datetime.min.time())
            if usar_tz:
                prevista_dt = timezone.make_aware(prevista_dt, agora.tzinfo)
            venceu = e["prevista"] < agora.date()
            if s["tipo"] == "ativo" and not venceu and (e["prevista"] - agora.date()).days <= 1:
                quando_vence = "hoje" if e["prevista"] == agora.date() else "amanhã"
                notificar(s, "Devolução próxima!",
                          f'O prazo de devolução do livro "{titulo_livro}" vence {quando_vence} '
                          f'({fmt(e["prevista"])}).',
                          limitar(prevista_dt - timedelta(days=1) + timedelta(hours=8)),
                          False, com_emprestimo=True)
            atrasou = (e["devolucao"] and e["devolucao"].date() > e["prevista"]) or \
                      (not e["devolucao"] and venceu)
            if atrasou:
                data_aviso = limitar(prevista_dt + timedelta(days=1, hours=8))
                notificar(s, "Devolução em atraso!",
                          f'O prazo de devolução do livro "{titulo_livro}" venceu em '
                          f'{fmt(e["prevista"])}. Devolva o exemplar o quanto antes.',
                          data_aviso, lida_por_idade(data_aviso, 0.7) and s["tipo"] != "ativo",
                          com_emprestimo=True)

        # ---------------- 5) PERSISTÊNCIA (em ordem cronológica) ---------------
        specs.sort(key=lambda s: s["data_pedido"])
        for s in specs:
            ex = s["exemplar"]
            pedido = criar(
                Pedido,
                datas=dict(data_pedido=s["data_pedido"], data_resposta=s["data_resposta"]),
                status=s["status"], edicao=s["edicao"], leitor=s["leitor"], exemplar=ex,
                data_pedido=s["data_pedido"], data_resposta=s["data_resposta"],
            )
            s["pedido"] = pedido
            e = s["emprestimo"]
            if e:
                emp = criar(
                    Emprestimo,
                    datas=dict(data_retirada=e["retirada"], data_devolucao=e["devolucao"],
                               data_regularizacao=e["data_reg"]),
                    exemplar=ex, pedido=pedido,
                    data_retirada=e["retirada"], data_devolucao=e["devolucao"],
                    data_prevista_devolucao=e["prevista"],
                    situacao_encerramento=e["situacao"],
                    data_regularizacao=e["data_reg"],
                    motivo_regularizacao=("Livro localizado e devolvido pelo leitor."
                                          if e["regularizado"] else ""),
                    regularizado=e["regularizado"],
                )
                s["emp_obj"] = emp

            # status final do exemplar
            if ex is not None:
                novo = s.get("exemplar_final")
                if novo == E_BAIX:
                    Exemplar.objects.filter(pk=ex.pk).update(
                        status=E_BAIX, data_baixa=e["devolucao"],
                        motivo_baixa="Livro perdido pelo leitor após o prazo de devolução.")
                elif novo:
                    Exemplar.objects.filter(pk=ex.pk).update(status=novo)

        for n in sorted(notifs, key=lambda n: n["data"]):
            emp = n["spec"].get("emp_obj") if n["com_emprestimo"] else None
            criar(Notificacao,
                  datas=dict(data_criacao=n["data"]),
                  titulo=n["titulo"], mensagem=n["mensagem"], lida=n["lida"],
                  data_criacao=n["data"], usuario_id=n["spec"]["leitor"].usuario_id,
                  emprestimo=emp)

        # ---------------- 6) CONFERÊNCIAS -------------------------------------
        depois = {
            "usuarios": Usuario.objects.count(),
            "leitores": Leitor.objects.count(),
            "livros": Livro.objects.count(),
            "edicoes": Edicao.objects.count(),
            "exemplares": Exemplar.objects.count(),
        }
        assert antes == depois, f"Algo mudou nos dados preservados! {antes} -> {depois}"

        # ---------------- 7) RESUMO -------------------------------------------
        hoje = agora.date()
        emps = Emprestimo.objects.all()
        em_aberto = emps.filter(situacao_encerramento__isnull=True, data_devolucao__isnull=True)
        atrasados = [x for x in em_aberto if x.data_prevista_devolucao < hoje]
        print("\n=== RESUMO ===  (seed: %s)" % seed)
        print("Removidos:", removidos)
        print("Preservados:", depois)
        print("Pedidos criados:", Pedido.objects.count())
        print("  por status:", dict(Counter(Pedido.objects.values_list("status", flat=True))))
        print("Empréstimos criados:", emps.count())
        print("  em aberto:", em_aberto.count(), "| atrasados:", len(atrasados))
        print("  devolvidos:", emps.filter(situacao_encerramento=S_DEV).count(),
              "| perdidos:", emps.filter(situacao_encerramento=S_PERD).count(),
              "(regularizados: %d)" % emps.filter(regularizado=True).count())
        print("Notificações criadas:", Notificacao.objects.count())
        print("Exemplares por status:", dict(Counter(Exemplar.objects.values_list("status", flat=True))))
        if atrasados:
            print("\nAtrasados agora:")
            for x in sorted(atrasados, key=lambda x: x.data_prevista_devolucao):
                dias = (hoje - x.data_prevista_devolucao).days
                nome = x.pedido.leitor.usuario.nome or x.pedido.leitor.usuario.email
                print(f"  - {nome}: \"{x.pedido.edicao.livro.titulo}\" "
                      f"(venceu em {fmt(x.data_prevista_devolucao)}, {dias} dia(s) de atraso)")

        if args.dry_run:
            print("\n--dry-run: nada foi gravado (transação desfeita).")
            raise DryRun


def main():
    ap = argparse.ArgumentParser(description="Limpa pedidos/empréstimos e gera um cenário realista.")
    ap.add_argument("--yes", action="store_true", help="não pedir confirmação")
    ap.add_argument("--dry-run", action="store_true", help="simula e desfaz no final")
    ap.add_argument("--sem-backup", action="store_true", help="não copiar o db.sqlite3 antes")
    ap.add_argument("--seed", type=int, default=None, help="semente aleatória (reprodutível)")
    ap.add_argument("--settings", default=None, help="módulo de settings, ex.: projeto.settings")
    args = ap.parse_args()

    _iniciar_django(args.settings)
    try:
        executar(args)
    except DryRun:
        pass


if __name__ == "__main__":
    main()
