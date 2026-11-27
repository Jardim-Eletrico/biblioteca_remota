import type { EdicaoForm } from "@/src/hooks/bibliotecario/useCadastroLivro";

interface FormularioEdicaoProps {
    edicao: EdicaoForm;
    indice: number;
    atualizarEdicao: <K extends keyof EdicaoForm>(
        indice: number,
        campo: K,
        valor: EdicaoForm[K]
    ) => void;
}

export default function FormularioEdicao({
    edicao,
    indice,
    atualizarEdicao,
}: FormularioEdicaoProps) {
    const prefixo = `edicao-${indice}`;

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Ano de publicação */}
            <div>
                <label
                    htmlFor={`${prefixo}-ano-publicacao`}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Ano de publicação *
                </label>

                <input
                    id={`${prefixo}-ano-publicacao`}
                    type="number"
                    min={1000}
                    max={9999}
                    value={edicao.ano_publicacao}
                    onChange={(e) =>
                        atualizarEdicao(
                            indice,
                            "ano_publicacao",
                            e.target.value
                        )
                    }
                    placeholder="Ex.: 2024"
                    required
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                />
            </div>

            {/* Editora */}
            <div>
                <label
                    htmlFor={`${prefixo}-editora`}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Editora *
                </label>

                <input
                    id={`${prefixo}-editora`}
                    type="text"
                    value={edicao.editora}
                    onChange={(e) =>
                        atualizarEdicao(indice, "editora", e.target.value)
                    }
                    placeholder="Nome da editora"
                    maxLength={200}
                    required
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                />
            </div>

            {/* Número de páginas */}
            <div>
                <label
                    htmlFor={`${prefixo}-numero-paginas`}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Número de páginas *
                </label>

                <input
                    id={`${prefixo}-numero-paginas`}
                    type="number"
                    min={1}
                    value={edicao.numero_paginas}
                    onChange={(e) =>
                        atualizarEdicao(
                            indice,
                            "numero_paginas",
                            e.target.value
                        )
                    }
                    placeholder="Ex.: 320"
                    required
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                />
            </div>

            {/* Número da edição */}
            <div>
                <label
                    htmlFor={`${prefixo}-edicao`}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Número da edição *
                </label>

                <input
                    id={`${prefixo}-edicao`}
                    type="text"
                    value={edicao.edicao}
                    onChange={(e) =>
                        atualizarEdicao(indice, "edicao", e.target.value)
                    }
                    placeholder="Ex.: 1ª, 2ª, Revisada"
                    maxLength={20}
                    required
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                />
            </div>

            {/* ISBN */}
            <div className="md:col-span-2">
                <label
                    htmlFor={`${prefixo}-isbn`}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    ISBN
                </label>

                <input
                    id={`${prefixo}-isbn`}
                    type="text"
                    value={edicao.isbn}
                    onChange={(e) =>
                        atualizarEdicao(indice, "isbn", e.target.value)
                    }
                    placeholder="Ex.: 978-85-00000-00-0"
                    maxLength={17}
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                />
            </div>

            {/* Capa */}
            <div className="md:col-span-2">
                <label
                    htmlFor={`${prefixo}-capa`}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Capa do livro
                </label>

                <input
                    id={`${prefixo}-capa`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        atualizarEdicao(
                            indice,
                            "capa",
                            e.target.files?.[0] ?? null
                        )
                    }
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-base file:font-medium dark:border-surface-mid dark:bg-surface-dark dark:text-gray-300 dark:file:bg-surface-mid dark:file:text-white"
                />

                {edicao.capa && (
                    <div className="mt-3 flex items-center gap-3">
                        <img
                            src={URL.createObjectURL(edicao.capa)}
                            alt="Pré-visualização da capa"
                            className="h-24 w-16 rounded-md border border-gray-stroke object-cover dark:border-surface-mid"
                        />

                        <div>
                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                {edicao.capa.name}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    atualizarEdicao(indice, "capa", null)
                                }
                                className="mt-1 text-base text-red-600 hover:underline dark:text-red-400"
                            >
                                Remover capa
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}