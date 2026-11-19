
import { useState } from "react";

import type { ExemplarResponse } from "@/src/types/exemplar";

interface TabelaExemplaresEdicaoProps {
    exemplares: ExemplarResponse[];
    carregando: boolean;
    salvando: boolean;
    onBaixar: (id: number, motivo: string) => Promise<boolean>;
}

const statusLabels: Record<string, string> = {
    disponivel: "Disponível",
    reservado: "Reservado",
    emprestado: "Emprestado",
    indisponivel: "Indisponível",
    baixado: "Baixado",
};

export default function TabelaExemplaresEdicao({
    exemplares,
    carregando,
    salvando,
    onBaixar,
}: TabelaExemplaresEdicaoProps) {
    const [exemplarSelecionado, setExemplarSelecionado] =
        useState<ExemplarResponse | null>(null);

    const [motivo, setMotivo] = useState("");

    function fecharModal() {
        if (salvando) return;

        setExemplarSelecionado(null);
        setMotivo("");
    }

    async function confirmarBaixa(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!exemplarSelecionado || !motivo.trim() || salvando) {
            return;
        }

        const sucesso = await onBaixar(
            exemplarSelecionado.id,
            motivo.trim()
        );

        if (sucesso) {
            setExemplarSelecionado(null);
            setMotivo("");
        }
    }

    if (carregando) {
        return (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Carregando exemplares...
            </p>
        );
    }

    return (
        <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Exemplares ({exemplares.length})
            </h5>

            {exemplares.length === 0 ? (
                <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Esta edição ainda não possui exemplares cadastrados.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-3">Tombo</th>
                                <th className="px-4 py-3">Situação</th>
                                <th className="px-4 py-3">Leitor</th>
                                <th className="px-4 py-3">Baixa patrimonial</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {exemplares.map((exemplar) => (
                                <tr
                                    key={exemplar.id}
                                    className="bg-white dark:bg-gray-900"
                                >
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {exemplar.tombo}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {statusLabels[exemplar.status] ?? exemplar.status}
                                    </td>

                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {exemplar.emprestado
                                            ? exemplar.leitor ?? "Leitor não identificado"
                                            : "—"}
                                    </td>

                                    <td className="min-w-48 px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {exemplar.status === "baixado" ? (
                                            <div>
                                                <p>
                                                    {exemplar.data_baixa
                                                        ? new Date(exemplar.data_baixa).toLocaleDateString("pt-BR")
                                                        : "Data não informada"}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {exemplar.motivo_baixa || "Sem motivo informado"}
                                                </p>
                                            </div>
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {["disponivel", "indisponivel", "emprestado"].includes(exemplar.status) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExemplarSelecionado(exemplar);
                                                    setMotivo("");
                                                }}
                                                className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                                            >
                                                Dar baixa
                                            </button>
                                        )}

                                        {exemplar.status === "baixado" && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Baixa realizada
                                            </span>
                                        )}

                                        {exemplar.status === "reservado" && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Não permitido
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {exemplarSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            fecharModal();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal-baixa"
                        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3
                                    id="titulo-modal-baixa"
                                    className="text-lg font-semibold text-gray-900 dark:text-white"
                                >
                                    Confirmar baixa patrimonial
                                </h3>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Exemplar: {exemplarSelecionado.tombo}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharModal}
                                disabled={salvando}
                                aria-label="Fechar modal"
                                className="text-xl text-gray-400 hover:text-gray-700 disabled:opacity-50 dark:hover:text-white"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                            {exemplarSelecionado.status === "emprestado"
                                ? "Este exemplar está emprestado. Ao confirmar, o empréstimo será encerrado como perdido e o exemplar será baixado do acervo."
                                : "Informe o motivo pelo qual este exemplar será baixado do acervo."}
                        </p>

                        <form onSubmit={confirmarBaixa} className="mt-4 space-y-4">
                            <div>
                                <label
                                    htmlFor="motivo-baixa"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Motivo da baixa
                                </label>

                                <textarea
                                    id="motivo-baixa"
                                    required
                                    minLength={1}
                                    rows={4}
                                    autoFocus
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Descreva o motivo da baixa..."
                                    disabled={salvando}
                                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    disabled={salvando}
                                    onClick={fecharModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={salvando || !motivo.trim()}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {salvando ? "Processando..." : "Confirmar baixa"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
