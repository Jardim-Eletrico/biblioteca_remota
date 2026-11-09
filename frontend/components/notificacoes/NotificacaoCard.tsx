import type { NotificacaoResponse } from "@/src/types/notificacoes";

interface NotificacaoCardProps {
    notificacao: NotificacaoResponse;
    onExcluir: (id: number) => void;
}

// Identifica o ícone conforme o conteúdo da notificação
function identificarTipo(titulo: string, mensagem: string) {
    const texto = `${titulo} ${mensagem}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (
        texto.includes("disponivel")
    ) {
        return "disponibilidade";
    }

    if (
        texto.includes("prazo") ||
        texto.includes("atraso") ||
        texto.includes("devolver") ||
        texto.includes("devolucao")
    ) {
        return "prazo";
    }

    if (
        texto.includes("devolveu") ||
        texto.includes("cancelado")
    ) {
        return "retorno";
    }

    return "emprestimo";
}

// Ícones das notificações
function IconeNotificacao({ tipo }: { tipo: string }) {
    const classes = "h-11 w-11 text-blue-600 dark:text-blue-500";

    if (tipo === "disponibilidade") {
        return (
            <svg viewBox="0 0 48 48" fill="currentColor" className={classes}>
                <path d="M12 17V12a12 12 0 0 1 24 0v5h3a3 3 0 0 1 3 3l-3 23H9L6 20a3 3 0 0 1 3-3h3Zm4 0h16v-5a8 8 0 0 0-16 0v5Z" />
            </svg>
        );
    }

    if (tipo === "prazo") {
        return (
            <svg viewBox="0 0 48 48" fill="currentColor" className={classes}>
                <circle cx="24" cy="24" r="23" />
                <path
                    d="M24 11v14l10 6"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    if (tipo === "retorno") {
        return (
            <svg viewBox="0 0 48 48" className={classes}>
                <path
                    fill="currentColor"
                    d="M7 5h34a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H25l-9 7v-7H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4Z"
                />
                <path
                    fill="white"
                    d="M24 31s-11-7-11-14a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 7-11 14-11 14Z"
                />
            </svg>
        );
    }

    // Empréstimo
    return (
        <svg viewBox="0 0 48 48" className={classes}>
            <path
                fill="currentColor"
                d="M3 9c8-4 15-3 21 2v32c-6-5-13-6-21-2V9Zm42 0c-8-4-15-3-21 2v32c6-5 13-6 21-2V9Z"
            />
        </svg>
    );
}

// Formata a data da notificação
function formatarData(dataString: string) {
    const data = new Date(dataString);

    if (Number.isNaN(data.getTime())) {
        return "";
    }

    const opcoes = {
        timeZone: "America/Sao_Paulo"
    };

    const hoje = new Date();

    const obterDia = (valor: Date) =>
        new Intl.DateTimeFormat("en-CA", {
            ...opcoes,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(valor);

    const diaNotificacao = obterDia(data);
    const diaAtual = obterDia(hoje);

    const ontem = new Date(hoje.getTime() - 86400000);
    const diaOntem = obterDia(ontem);

    const horario = new Intl.DateTimeFormat("pt-BR", {
        ...opcoes,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(data);

    if (diaNotificacao === diaAtual) {
        return `Hoje às ${horario}`;
    }

    if (diaNotificacao === diaOntem) {
        return `Ontem às ${horario}`;
    }

    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
        ...opcoes,
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(data);

    return `Em ${dataFormatada}`;
}

export default function NotificacaoCard({
    notificacao,
    onExcluir
}: NotificacaoCardProps) {

    const tipo = identificarTipo(
        notificacao.titulo,
        notificacao.mensagem
    );

    return (
        <article className="
            relative flex w-full items-center gap-3
            rounded-3xl p-3 pr-10
            bg-white text-zinc-900
            shadow-[0_3px_8px_rgba(0,0,0,0.20)]
            dark:bg-[#202020] dark:text-white
        ">

            {/* Ícone */}
            <div className="flex shrink-0 items-center justify-center">
                <IconeNotificacao tipo={tipo} />
            </div>

            {/* Divisor */}
            <div className="
                w-px self-stretch shrink-0
                bg-zinc-200
                dark:bg-zinc-500
            " />

            {/* Conteúdo */}
            <div className="min-w-0 flex-1 py-1">

                <h3 className="
                    text-sm font-semibold leading-snug
                    break-words
                ">
                    {notificacao.titulo}
                </h3>

                <p className="
                    mt-1 text-xs leading-snug
                    text-zinc-500
                    dark:text-zinc-400
                    break-words
                ">
                    {notificacao.mensagem}
                </p>

                <p className="
                    mt-2 text-[11px]
                    text-zinc-500
                    dark:text-zinc-500
                ">
                    {formatarData(notificacao.data_criacao)}
                </p>

            </div>

            {/* Excluir */}
            <button
                type="button"
                onClick={() => onExcluir(notificacao.id)}
                aria-label="Excluir notificação"
                title="Excluir notificação"
                className="
                    absolute right-3 top-2
                    flex h-6 w-6 items-center justify-center
                    rounded-full
                    text-lg leading-none
                    text-zinc-500
                    hover:bg-red-100 hover:text-red-600
                    dark:text-zinc-400
                    dark:hover:bg-red-950 dark:hover:text-red-400
                    transition-colors
                "
            >
                ×
            </button>

        </article>
    );
}