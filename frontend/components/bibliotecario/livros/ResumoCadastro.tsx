import type { LivroForm, EdicaoForm } from "@/src/hooks/bibliotecario/useCadastroLivro";

interface ResumoCadastroProps {
    livro: LivroForm;
    edicoes: EdicaoForm[];
}

export default function ResumoCadastro({
    livro,
    edicoes,
}: ResumoCadastroProps) {
    const totalExemplares = edicoes.reduce(
        (total, edicao) => total + (Number(edicao.quantidade_exemplares) || 0),
        0
    );

    return (
        <section className="rounded-xl border border-gray-stroke bg-white p-6 shadow-sm dark:border-surface-mid dark:bg-surface-dark">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resumo do cadastro
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Confira as informações antes de cadastrar o livro.
                </p>
            </div>

            <div className="space-y-4">
                {/* Dados do livro */}
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Livro
                    </p>

                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {livro.titulo.trim() || "Título não informado"}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {livro.autor.trim() || "Autor não informado"}
                    </p>
                </div>

                <div className="border-t border-gray-stroke dark:border-surface-mid" />

                {/* Quantidades */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Edições
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                            {edicoes.length}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Exemplares
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                            {totalExemplares}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-stroke dark:border-surface-mid" />

                {/* Exemplares por edição */}
                <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Exemplares por edição
                    </h3>

                    <div className="space-y-2">
                        {edicoes.map((edicao, indice) => (
                            <div
                                key={indice}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <span className="text-gray-600 dark:text-gray-300">
                                    Edição {indice + 1}
                                </span>

                                <span className="font-medium text-gray-900 dark:text-white">
                                    {Number(edicao.quantidade_exemplares) || 0}{" "}
                                    {Number(edicao.quantidade_exemplares) === 1
                                        ? "exemplar"
                                        : "exemplares"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}