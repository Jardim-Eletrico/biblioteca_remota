
import type { LivroResponse } from "@/src/types/livro";
import type { EdicaoResponse } from "@/src/types/edicao";

interface CardLivroProps {
    livro: LivroResponse;
    edicoes: EdicaoResponse[];
    onDetalhes: () => void;
}

export default function CardLivro({
    livro,
    edicoes,
    onDetalhes,
}: CardLivroProps) {
    const totalExemplares = edicoes.reduce(
        (total, edicao) => total + edicao.total_exemplares,
        0
    );

    const exemplaresDisponiveis = edicoes.reduce(
        (total, edicao) => total + edicao.exemplares_disponiveis,
        0
    );

    return (
        <article className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {livro.titulo}
                        </h3>

                        {livro.subtitulo && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {livro.subtitulo}
                            </p>
                        )}
                    </div>

                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {edicoes.length} {edicoes.length === 1 ? "edição" : "edições"}
                    </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Autor: {livro.autor}
                </p>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Ano original: {livro.ano_original}
                </p>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    CDD: {livro.cdd ?? "Não informado"}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {livro.generos
                        .split(",")
                        .map((genero) => genero.trim())
                        .filter(Boolean)
                        .map((genero) => (
                            <span
                                key={genero}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            >
                                {genero}
                            </span>
                        ))}
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Exemplares disponíveis
                    </p>

                    <p className="font-semibold text-gray-900 dark:text-white">
                        {exemplaresDisponiveis} / {totalExemplares}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onDetalhes}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Ver detalhes
                </button>
            </div>
        </article>
    );
}
