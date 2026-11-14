import type { EdicaoForm } from "@/src/hooks/bibliotecario/useCadastroLivro";

import CardEdicao from "./CardEdicao";

interface ListaEdicoesProps {
    edicoes: EdicaoForm[];
    atualizarEdicao: <K extends keyof EdicaoForm>(
        indice: number,
        campo: K,
        valor: EdicaoForm[K]
    ) => void;
    adicionarEdicao: () => void;
    removerEdicao: (indice: number) => void;
}

export default function ListaEdicoes({
    edicoes,
    atualizarEdicao,
    adicionarEdicao,
    removerEdicao,
}: ListaEdicoesProps) {
    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edições do livro
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Cadastre uma ou mais edições para esta obra.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={adicionarEdicao}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <span className="text-lg leading-none">+</span>
                    Adicionar edição
                </button>
            </div>

            <div className="space-y-5">
                {edicoes.map((edicao, indice) => (
                    <CardEdicao
                        key={indice}
                        edicao={edicao}
                        indice={indice}
                        totalEdicoes={edicoes.length}
                        atualizarEdicao={atualizarEdicao}
                        removerEdicao={removerEdicao}
                    />
                ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
                {edicoes.length} {edicoes.length === 1 ? "edição cadastrada" : "edições cadastradas"}
            </p>
        </section>
    );
}