
import type { EmprestimoResponse } from "@/src/types/emprestimo";
import StatusBadge from "./StatusBadge";

interface EmprestimoTabelaProps {
  emprestimos: EmprestimoResponse[];
  emprestimoEmAcao: number | null;
  onDevolver: (emprestimoId: number) => void;
}

function formatarData(data: string | null): string {
  if (!data) return "—";

  const dataFormatada = data.includes("T")
    ? new Date(data)
    : new Date(`${data}T00:00:00`);

  return dataFormatada.toLocaleDateString("pt-BR");
}

export default function EmprestimoTabela({
  emprestimos,
  emprestimoEmAcao,
  onDevolver,
}: EmprestimoTabelaProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th className="px-5 py-4">Leitor</th>
            <th className="px-5 py-4">Livro</th>
            <th className="px-5 py-4">Tombo</th>
            <th className="px-5 py-4">Retirada</th>
            <th className="px-5 py-4">Devolução prevista</th>
            <th className="px-5 py-4">Situação</th>
            <th className="px-5 py-4">Ação</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {emprestimos.map((emprestimo) => (
            <tr
              key={emprestimo.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
            >
              <td className="px-5 py-4 font-medium">
                {emprestimo.leitor}
              </td>

              <td className="px-5 py-4">
                {emprestimo.livro}
              </td>

              <td className="px-5 py-4">
                {emprestimo.tombo}
              </td>

              <td className="px-5 py-4">
                {formatarData(emprestimo.data_retirada)}
              </td>

              <td className="px-5 py-4">
                {formatarData(emprestimo.data_prevista_devolucao)}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={emprestimo.situacao} />
              </td>

              <td className="px-5 py-4">
                {emprestimo.situacao !== "Devolvido" ? (
                  <button
                    type="button"
                    disabled={emprestimoEmAcao === emprestimo.id}
                    onClick={() => onDevolver(emprestimo.id)}
                    className="whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    Registrar devolução
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">
                    Devolvido em{" "}
                    {formatarData(emprestimo.data_devolucao)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
