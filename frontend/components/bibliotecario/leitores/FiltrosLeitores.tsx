export type FiltroLeitor = "todos" | "atrasados" | "emDia";

interface FiltrosLeitoresProps {
    filtro: FiltroLeitor;
    onFiltroChange: (filtro: FiltroLeitor) => void;
    contagens: {
        todos: number;
        atrasados: number;
        emDia: number;
    };
}

const filtros: {
    valor: FiltroLeitor;
    label: string;
}[] = [
    { valor: "todos", label: "Todos" },
    { valor: "atrasados", label: "Atrasados" },
    { valor: "emDia", label: "Em dia" },
];

export default function FiltrosLeitores({
    filtro,
    onFiltroChange,
    contagens,
}: FiltrosLeitoresProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {filtros.map((item) => {
                const selecionado = filtro === item.valor;

                return (
                    <button
                        key={item.valor}
                        type="button"
                        aria-pressed={selecionado}
                        onClick={() => onFiltroChange(item.valor)}
                        className={`
                            flex items-center gap-2 rounded-lg border px-4 py-2
                            text-sm font-medium transition-colors
                            ${
                                selecionado
                                    ? "border-primary bg-primary text-white"
                                    : "border-gray-stroke bg-white text-text-muted hover:border-primary hover:text-primary dark:border-surface-mid dark:bg-surface-dark dark:text-text-light"
                            }
                        `}
                    >
                        <span>{item.label}</span>

                        <span
                            className={`
                                rounded-full px-2 py-0.5 text-xs
                                ${
                                    selecionado
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-background text-text-muted dark:bg-surface-mid dark:text-text-light"
                                }
                            `}
                        >
                            {contagens[item.valor]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}