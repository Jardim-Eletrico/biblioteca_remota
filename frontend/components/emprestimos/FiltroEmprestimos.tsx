
type FiltroEmprestimosProps = {
    filtro: "ativos" | "devolvidos";
    onChange: (filtro: "ativos" | "devolvidos") => void;
};

export default function FiltroEmprestimos({
    filtro,
    onChange,
}: FiltroEmprestimosProps) {
    const filtros = [
        { valor: "ativos", titulo: "Ativos" },
        { valor: "devolvidos", titulo: "Devolvidos" },
    ] as const;

    return (
        <div className="mb-6 flex gap-3">
            {filtros.map((item) => (
                <button
                    key={item.valor}
                    type="button"
                    onClick={() => onChange(item.valor)}
                    className={`rounded-lg px-5 py-2 font-medium transition-colors ${
                        filtro === item.valor
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                    {item.titulo}
                </button>
            ))}
        </div>
    );
}
