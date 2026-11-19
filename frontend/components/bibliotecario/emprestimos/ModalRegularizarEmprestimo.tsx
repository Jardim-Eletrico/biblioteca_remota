
import type { FormEvent } from "react";

interface ModalRegularizarEmprestimoProps {
    livro: string;
    leitor: string;
    motivo: string;
    carregando: boolean;
    onMotivoChange: (motivo: string) => void;
    onFechar: () => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ModalRegularizarEmprestimo({
    livro,
    leitor,
    motivo,
    carregando,
    onMotivoChange,
    onFechar,
    onSubmit,
}: ModalRegularizarEmprestimoProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-5">
                    <h2 className="text-xl font-bold">
                        Regularizar empréstimo
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Informe o motivo pelo qual a situação deste empréstimo
                        está sendo regularizada.
                    </p>
                </div>

                <div className="mb-5 space-y-1 rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
                    <p>
                        <span className="font-semibold">Livro:</span> {livro}
                    </p>
                    <p>
                        <span className="font-semibold">Leitor:</span> {leitor}
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    <label
                        htmlFor="motivo-regularizacao"
                        className="mb-2 block text-sm font-medium"
                    >
                        Motivo da regularização
                    </label>

                    <textarea
                        id="motivo-regularizacao"
                        value={motivo}
                        onChange={(e) => onMotivoChange(e.target.value)}
                        rows={4}
                        required
                        maxLength={2000}
                        placeholder="Descreva o motivo da regularização..."
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                    />

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={onFechar}
                            disabled={carregando}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={carregando || !motivo.trim()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {carregando ? "Regularizando..." : "Confirmar regularização"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
