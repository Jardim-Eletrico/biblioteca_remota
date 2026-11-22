export function formatarData(data: string | null): string {
    if (!data) return "—";

    const dataFormatada = new Date(data);

    return dataFormatada.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
}