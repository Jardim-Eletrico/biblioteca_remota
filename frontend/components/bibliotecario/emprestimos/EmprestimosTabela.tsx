
import type {
  FiltroEmprestimo,
  EmprestimoResponse,
} from "@/src/types/emprestimo";

import StatusBadge from "./StatusBadge";

interface EmprestimoTabelaProps {
  emprestimos: EmprestimoResponse[];
  emprestimoEmAcao: number | null;
  onDevolver: (emprestimoId: number) => void;
  filtro: FiltroEmprestimo;
  onFiltroChange: (filtro: FiltroEmprestimo) => void;
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
  filtro,
  onFiltroChange,
}: EmprestimoTabelaProps) {
  const emprestimosFiltrados = emprestimos.filter((emprestimo) => {
    switch (filtro) {
      case "Em andamento":
        return emprestimo.situacao === "Em andamento";

      case "Atrasados":
        return emprestimo.situacao === "Atrasado";

      case "Devolvidos":
        return emprestimo.situacao === "Devolvido";

      default:
        return true;
    }
  });

  const filtros: FiltroEmprestimo[] = [
    "Todos",
    "Em andamento",
    "Atrasados",
    "Devolvidos",
  ];

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onFiltroChange(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filtro === item
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Tabela */}
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
            {emprestimosFiltrados.length > 0 ? (
              emprestimosFiltrados.map((emprestimo) => {
                console.log("ID:", emprestimo.id);
                console.log("Data de retirada:", emprestimo.data_retirada);
                console.log("Tipo:", typeof emprestimo.data_retirada);

                return (
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Nenhum empréstimo encontrado nesta categoria.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
