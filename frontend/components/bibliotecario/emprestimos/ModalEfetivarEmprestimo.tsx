import type { FormEvent } from "react";

import type { PedidoResponse } from "@/src/types/pedido";
import type { ExemplarPublicoResponse } from "@/src/types/exemplar";

interface ModalEfetivarEmprestimoProps {
    pedido: PedidoResponse;
    exemplares: ExemplarPublicoResponse[];
    exemplarSelecionado: number | "";
    dataPrevista: string;
    codigoConfirmacao: string;
    carregandoExemplares: boolean;
    pedidoEmAcao: number | null;

    onFechar: () => void;
    onExemplarChange: (id: number | "") => void;
    onDataPrevistaChange: (data: string) => void;
    onCodigoConfirmacaoChange: (codigo: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ModalEfetivarEmprestimo({
    pedido,
    exemplares,
    exemplarSelecionado,
    codigoConfirmacao,
    carregandoExemplares,
    pedidoEmAcao,
    onFechar,
    onExemplarChange,
    onCodigoConfirmacaoChange,
    onSubmit,
}: ModalEfetivarEmprestimoProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
                className="w-full max-w-lg rounded-xl bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="modal-titulo"
                            className="text-xl font-bold text-gray-900 dark:text-white"
                        >
                            Efetivar empréstimo
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {pedido.titulo}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onFechar}
                        className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                {carregandoExemplares ? (
                    <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                        Carregando exemplar reservado...
                    </p>
                ) : exemplares.length === 0 ? (
                    <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Não foi encontrado o exemplar reservado para este pedido.
                    </div>
                ) : (
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="exemplar"
                                className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
                            >
                                Exemplar reservado
                            </label>

                            <select
                                id="exemplar"
                                required
                                value={exemplarSelecionado}
                                onChange={(e) =>
                                    onExemplarChange(
                                        e.target.value ? Number(e.target.value) : ""
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">
                                    Selecione um exemplar
                                </option>

                                {exemplares.map((exemplar) => (
                                    <option
                                        key={exemplar.id}
                                        value={exemplar.id}
                                    >
                                        Tombo: {exemplar.tombo} — {exemplar.editora} (
                                        {exemplar.ano_publicacao})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="codigo-confirmacao"
                                className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
                            >
                                Código de confirmação
                            </label>

                            <input
                                id="codigo-confirmacao"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="Digite o código de 6 dígitos"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                                value={codigoConfirmacao}
                                onChange={(e) =>
                                    onCodigoConfirmacaoChange(
                                        e.target.value.replace(/\D/g, "").slice(0, 6)
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm tracking-widest text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                            />

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Solicite ao leitor o código recebido por e-mail.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onFechar}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    !exemplarSelecionado ||
                                    codigoConfirmacao.length !== 6 ||
                                    pedidoEmAcao !== null
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {pedidoEmAcao === pedido.id
                                    ? "Efetivando..."
                                    : "Confirmar empréstimo"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}