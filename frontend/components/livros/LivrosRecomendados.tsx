import type { LivroComEdicao } from "@/src/types/livro";

interface LivrosRecomendadosProps {
    livros: LivroComEdicao[];
    onAbrirLivro?: (livroId: number, edicaoId: number) => void;
}

export default function LivrosRecomendados({
    livros,
    onAbrirLivro
}: LivrosRecomendadosProps) {

    if (livros.length === 0) {
        return null;
    }

    return (
        <section className="mt-8">

            <h2 className="
                mb-4 text-base font-bold
                font-ubuntu
                text-dark-blue
                dark:text-light-blue-logo
            ">
                Sugestões baseadas no seu conteúdo
            </h2>

            {/* LISTA HORIZONTAL */}
            <div className="
                flex gap-4
                overflow-x-auto
                pb-3
                scrollbar-thin
            ">

                {livros.map(({ livro, edicao }) => {

                    const disponivel =
                        edicao.exemplares_disponiveis > 0;

                    return (
                        <article
                            key={edicao.id}
                            className="w-36 shrink-0"
                        >

                            {/* CAPA */}
                            <div className="
                                relative aspect-[2/3]
                                overflow-hidden rounded-lg
                                bg-light-gray
                                dark:bg-surface-mid
                            ">

                                {edicao.capa ? (
                                    <img
                                        src={edicao.capa}
                                        alt={`Capa de ${livro.titulo}`}
                                        className="
                                            h-full w-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    <div className="
                                        flex h-full
                                        items-center justify-center
                                        text-xs text-text-muted
                                    ">
                                        Capa indisponível
                                    </div>
                                )}

                                {/* INDISPONIBILIDADE */}
                                {!disponivel && (
                                    <div className="
                                        absolute inset-0
                                        flex items-end justify-center
                                        bg-reserved-blue-bg
                                        p-2
                                    ">
                                        <span className="
                                            font-bold text-sm
                                            text-light-blue-logo
                                        ">
                                            Indisponível
                                        </span>
                                    </div>
                                )}

                            </div>

                            {/* TÍTULO */}
                            <p className="
                                mt-1 text-sm font-medium
                                font-ubuntu
                                text-dark-blue
                                dark:text-light-blue-logo
                                line-clamp-2
                            ">
                                {livro.titulo}
                            </p>

                            {/* AUTOR */}
                            <p className="
                                text-xs
                                text-text-muted
                                dark:text-text-light
                                line-clamp-1
                            ">
                                {livro.autor}
                            </p>

                            {/* ABRIR DETALHES */}
                            {onAbrirLivro && (
                                <button
                                    type="button"
                                    onClick={() => onAbrirLivro(
                                        livro.id,
                                        edicao.id
                                    )}
                                    className="
                                        mt-1 text-xs
                                        text-primary
                                        hover:underline
                                    "
                                >
                                    Ver detalhes
                                </button>
                            )}

                        </article>
                    );
                })}

            </div>

        </section>
    );
}