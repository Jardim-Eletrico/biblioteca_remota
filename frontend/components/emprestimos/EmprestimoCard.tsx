
import { useState } from "react";

import { formatarDataHora } from "@/src/utils/formatarDataHora";
import type { PedidoResponse } from "@/src/types/pedido";

import StatusEmprestimo from "./StatusEmprestimo";
import ModalCancelarPedido from "./ConfirmarCancelamentoModal";

interface EmprestimoCardProps {
    pedido: PedidoResponse;
    onCancelar?: (pedidoId: number) => Promise<boolean>;
    podeCancelar?: boolean;
    cancelando?: boolean;
}

export default function EmprestimoCard({
    pedido,
    onCancelar,
    podeCancelar = false,
    cancelando = false,
}: EmprestimoCardProps) {
    const [modalAberta, setModalAberta] = useState(false);

    const emprestimo = pedido.emprestimo;

    function obterStatus(): "Pendente" | "Aprovado" | "Emprestado" | "Atrasado" | "Devolvido" {
        if (pedido.status === "pendente") return "Pendente";
        if (pedido.status === "aprovado" && !emprestimo) return "Aprovado";

        if (emprestimo?.situacao_encerramento === "devolvido") {
            return "Devolvido";
        }

        if (emprestimo && !emprestimo.data_devolucao) {
            const hoje = new Date();
            const dataPrevista = new Date(
                emprestimo.data_prevista_devolucao
            );

            if (dataPrevista < hoje) return "Atrasado";

            return "Emprestado";
        }

        return "Aprovado";
    }

    const status = obterStatus();

    async function confirmarCancelamento() {
        if (!onCancelar) return;

        const sucesso = await onCancelar(pedido.id);

        if (sucesso) {
            setModalAberta(false);
        }
    }

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-4 sm:flex-row">

                {/* Capa */}
                <div className="shrink-0">
                    {pedido.capa ? (
                        <img
                            src={pedido.capa}
                            alt={`Capa de ${pedido.titulo}`}
                            className="h-40 w-28 rounded-lg object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex h-40 w-28 items-center justify-center rounded-lg bg-gray-200 text-center text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            Sem capa
                        </div>
                    )}
                </div>

                {/* Informações */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {pedido.titulo}
                            </h3>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {pedido.autor}
                            </p>
                        </div>

                        <StatusEmprestimo status={status} />
                    </div>

                    {emprestimo && (
                        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Tombo:</strong> {emprestimo.tombo}
                            </p>

                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Retirada:</strong>{" "}
                                {formatarDataHora(emprestimo.data_retirada)}
                            </p>

                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Devolução prevista:</strong>{" "}
                                {formatarDataHora(emprestimo.data_prevista_devolucao)}
                            </p>

                            {emprestimo.data_devolucao && (
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Devolvido em:</strong>{" "}
                                    {formatarDataHora(emprestimo.data_devolucao)}
                                </p>
                            )}
                        </div>
                    )}

                    {podeCancelar && onCancelar && (
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                disabled={cancelando}
                                onClick={() => setModalAberta(true)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                            >
                                Cancelar pedido
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ModalCancelarPedido
                aberto={modalAberta}
                carregando={cancelando}
                onFechar={() => setModalAberta(false)}
                onConfirmar={confirmarCancelamento}
            />
        </article>
    );
}
