import type { EdicaoForm } from "@/src/hooks/bibliotecario/useCadastroLivro";

import FormularioEdicao from "./FormularioEdicao";
import FormularioExemplares from "./FormularioExemplares";

interface CardEdicaoProps {
    edicao: EdicaoForm;
    indice: number;
    totalEdicoes: number;
    atualizarEdicao: <K extends keyof EdicaoForm>(
        indice: number,
        campo: K,
        valor: EdicaoForm[K]
    ) => void;
    removerEdicao: (indice: number) => void;
}

export default function CardEdicao({
    edicao,
    indice,
    totalEdicoes,
    atualizarEdicao,
    removerEdicao,
}: CardEdicaoProps) {
    return (
        <section className="rounded-xl border border-gray-stroke bg-white p-6 shadow-sm dark:border-surface-mid dark:bg-surface-dark">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Edição {indice + 1}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Informe os dados desta edição e seus exemplares.
                    </p>
                </div>

                {totalEdicoes > 1 && (
                    <button
                        type="button"
                        onClick={() => removerEdicao(indice)}
                        className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                        Remover edição
                    </button>
                )}
            </div>

            <FormularioEdicao
                edicao={edicao}
                indice={indice}
                atualizarEdicao={atualizarEdicao}
            />

            <div className="my-6 border-t border-gray-stroke dark:border-surface-mid" />

            <FormularioExemplares
                quantidade={edicao.quantidade_exemplares}
                indice={indice}
                atualizarQuantidade={(indice, quantidade) =>
                    atualizarEdicao(
                        indice,
                        "quantidade_exemplares",
                        quantidade
                    )
                }
            />
        </section>
    );
}