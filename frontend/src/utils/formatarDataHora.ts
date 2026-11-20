export function formatarDataHora(data: string | null): string {
    if (!data) return "—";

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "America/Sao_Paulo",
    }).format(new Date(data));
}

