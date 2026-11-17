
import type { PedidoResponse } from "@/src/types/pedido";
import StatusBadge from "./StatusBadge";

interface PedidoCardProps {
  pedido: PedidoResponse;
  pedidoEmAcao: number | null;
  onRecusar: (pedidoId: number) => void;
  onCancelar: (pedidoId: number) => void;
  onEfetivar: (pedido: PedidoResponse) => void;
}

function formatarData(data: string | null): string {
  if (!data) return "—";

  const dataFormatada = data.includes("T")
    ? new Date(data)
    : new Date(`${data}T00:00:00`);

  return dataFormatada.toLocaleDateString("pt-BR");
}

export default function PedidoCard({
  pedido,
  pedidoEmAcao,
  onRecusar,
  onCancelar,
  onEfetivar,
}: PedidoCardProps) {
  const carregando = pedidoEmAcao === pedido.id;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pedido #{pedido.id}
          </p>

          <h2 className="mt-1 font-semibold">
            {pedido.titulo}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pedido.autor}
          </p>
        </div>

        <StatusBadge status={pedido.status} />
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Leitor:{" "}
          </span>
          {pedido.nome_leitor}
        </p>

        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Edição:{" "}
          </span>
          {pedido.edicao}
        </p>

        <p>
          <span className="text-gray-500 dark:text-gray-400">
            Data do pedido:{" "}
          </span>
          {formatarData(pedido.data_pedido)}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {pedido.status === "pendente" && (
          <button
            type="button"
            disabled={carregando}
            onClick={() => onRecusar(pedido.id)}
            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Recusar
          </button>
        )}

        {pedido.status === "aprovado" && (
          <button
            type="button"
            disabled={carregando}
            onClick={() => onEfetivar(pedido)}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Efetivar empréstimo
          </button>
        )}

        <button
          type="button"
          disabled={carregando}
          onClick={() => onCancelar(pedido.id)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Cancelar
        </button>
      </div>
    </article>
  );
}
