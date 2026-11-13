
interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const estilos: Record<string, string> = {
    pendente:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    aprovado:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    recusado:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    cancelado:
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    "Em andamento":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Atrasado:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    Devolvido:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        estilos[status] ??
        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}
