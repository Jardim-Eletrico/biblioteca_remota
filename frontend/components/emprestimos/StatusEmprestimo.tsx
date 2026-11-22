
type StatusEmprestimoProps = {
    status: "Pendente" | "Aprovado" | "Emprestado" | "Atrasado" | "Devolvido";
    className?: string;
};

const estilos = {
    Pendente:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",

    Aprovado:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",

    Emprestado:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",

    Atrasado:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",

    Devolvido:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export default function StatusEmprestimo({
    status,
    className
}: StatusEmprestimoProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${estilos[status]} ${className || ""}`}
        >
            {status}
        </span>
    );
}
