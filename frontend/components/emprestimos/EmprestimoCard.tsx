
import { useState } from "react";

import { formatarData } from "@/src/utils/formatarDataHora";
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
            <div className="flex flex-col gap-2">

                {/* Capa */}
                <div className="flex gap-3 shrink-0">
                    {pedido.capa ? (
                        <>
                            <img
                                src={pedido.capa}
                                alt={`Capa de ${pedido.titulo}`}
                                className="w-28 shrink-0 rounded-lg object-cover shadow-sm aspect-2/3 md:w-50"
                            />

                            <div className="flex flex-col gap-2 min-w-0 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white md:text-2xl">
                                    {pedido.titulo}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 md:text-[20px]">
                                    {pedido.autor}
                                </p>

                                <StatusEmprestimo className="w-fit md:text-[18px]" status={status} />
                            </div>
                        </>
                    ) : (
                        <div className="
                            relative flex w-full
                            aspect-2/3 max-h-125
                            items-center justify-center
                            rounded-xl border border-black
                            text-text-muted
                            dark:border-white
                            dark:text-text-light
                        ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="50"
                                fill="currentColor"
                                className="
                                    bi bi-book
                                    text-black dark:text-white
                                    sm:size-20
                                "
                                viewBox="0 0 16 16"
                            >
                                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Informações */}
                <div className="min-w-0 flex-1">

                    {emprestimo && (
                        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
                            <p className="text-gray-700 dark:text-gray-300 md:text-[18px]">
                                <strong>Tombo:</strong> {emprestimo.tombo}
                            </p>

                            <p className="text-gray-700 dark:text-gray-300 md:text-[18px]">
                                <strong>Retirada:</strong>{" "}
                                {formatarData(emprestimo.data_retirada)}
                            </p>

                            <p className="text-gray-700 dark:text-gray-300 md:text-[18px]">
                                <strong>Devolução prevista:</strong>{" "}
                                {formatarData(emprestimo.data_prevista_devolucao)}
                            </p>

                            {emprestimo.data_devolucao && (
                                <p className="text-gray-700 dark:text-gray-300 md:text-[18px]">
                                    <strong>Devolvido em:</strong>{" "}
                                    {formatarData(emprestimo.data_devolucao)}
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
