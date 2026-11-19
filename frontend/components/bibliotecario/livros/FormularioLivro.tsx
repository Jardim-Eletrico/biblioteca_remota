import type { LivroForm } from "@/src/hooks/bibliotecario/useCadastroLivro";
import type { CDDResponse } from "@/src/types/livro";

interface FormularioLivroProps {
    livro: LivroForm;
    cdds: CDDResponse[];
    carregandoCDDs: boolean;
    atualizarLivro: <K extends keyof LivroForm>(
        campo: K,
        valor: LivroForm[K]
    ) => void;
}

export default function FormularioLivro({
    livro,
    cdds,
    carregandoCDDs,
    atualizarLivro,
}: FormularioLivroProps) {
    return (
        <section className="rounded-xl border border-gray-stroke bg-white p-6 shadow-sm dark:border-surface-mid dark:bg-surface-dark">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dados do livro
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Informe os dados principais da obra.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Título */}
                <div className="md:col-span-2">
                    <label
                        htmlFor="titulo"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Título *
                    </label>

                    <input
                        id="titulo"
                        type="text"
                        value={livro.titulo}
                        onChange={(e) =>
                            atualizarLivro("titulo", e.target.value)
                        }
                        placeholder="Digite o título do livro"
                        required
                        maxLength={200}
                        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    />
                </div>

                {/* Subtítulo */}
                <div className="md:col-span-2">
                    <label
                        htmlFor="subtitulo"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Subtítulo
                    </label>

                    <input
                        id="subtitulo"
                        type="text"
                        value={livro.subtitulo}
                        onChange={(e) =>
                            atualizarLivro("subtitulo", e.target.value)
                        }
                        placeholder="Digite o subtítulo, se houver"
                        maxLength={200}
                        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    />
                </div>

                {/* Autor */}
                <div>
                    <label
                        htmlFor="autor"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Autor *
                    </label>

                    <input
                        id="autor"
                        type="text"
                        value={livro.autor}
                        onChange={(e) =>
                            atualizarLivro("autor", e.target.value)
                        }
                        placeholder="Nome do autor"
                        required
                        maxLength={200}
                        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    />
                </div>

                {/* Ano original */}
                <div>
                    <label
                        htmlFor="ano_original"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Ano original *
                    </label>

                    <input
                        id="ano_original"
                        type="text"
                        value={livro.ano_original}
                        onChange={(e) =>
                            atualizarLivro("ano_original", e.target.value)
                        }
                        placeholder="Ex.: 1899 ou século XIX"
                        required
                        maxLength={30}
                        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    />
                </div>

                {/* Gêneros */}
                <div>
                    <label
                        htmlFor="generos"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Gêneros
                    </label>

                    <input
                        id="generos"
                        type="text"
                        value={livro.generos}
                        onChange={(e) =>
                            atualizarLivro("generos", e.target.value)
                        }
                        placeholder="Ex.: Romance, Drama, Ficção"
                        maxLength={90}
                        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    />

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Separe os gêneros por vírgula.
                    </p>
                </div>

                {/* CDD */}
                <div>
                    <label
                        htmlFor="cdd"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Classificação Decimal de Dewey (CDD)
                    </label>

                    <select
                        id="cdd"
                        value={livro.cdd}
                        onChange={(e) =>
                            atualizarLivro(
                                "cdd",
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        disabled={carregandoCDDs}
                        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    >
                        <option value="">
                            {carregandoCDDs
                                ? "Carregando classificações..."
                                : "Selecione uma classificação"}
                        </option>

                        {cdds.map((cdd) => (
                            <option key={cdd.id} value={cdd.id}>
                                {cdd.codigo} - {cdd.descricao}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                    <label
                        htmlFor="descricao"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="descricao"
                        value={livro.descricao}
                        onChange={(e) =>
                            atualizarLivro("descricao", e.target.value)
                        }
                        placeholder="Escreva uma breve descrição sobre o livro"
                        maxLength={1000}
                        rows={4}
                        className="w-full resize-y rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                    />

                    <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                        {livro.descricao.length}/1000 caracteres
                    </p>
                </div>
            </div>
        </section>
    );
}