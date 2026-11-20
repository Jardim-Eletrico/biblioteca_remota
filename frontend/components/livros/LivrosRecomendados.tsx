
import type { LivroRecomendadoResponse } from "@/src/types/livro";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LivrosRecomendadosProps {
    livros: LivroRecomendadoResponse[];
    onAbrirLivro?: (livroId: number, edicaoId: number) => void;
}

interface LivroRecomendadoCardProps {
    livro: LivroRecomendadoResponse["livro"];
    edicao: LivroRecomendadoResponse["edicao"];
    onAbrirLivro?: (livroId: number, edicaoId: number) => void;
}

function LivroRecomendadoCard({
    livro,
    edicao,
    onAbrirLivro
}: LivroRecomendadoCardProps) {
    const [imageError, setImageError] = useState(false);

    const disponivel = edicao.exemplares_disponiveis > 0;

    const conteudo = (
        <article className="flex flex-col h-full">
            {/* CAPA */}
            <div className="
                relative w-full
                aspect-2/3
                overflow-hidden
                rounded-xl
                bg-light-gray
                dark:bg-surface-mid 
            ">

                {!imageError && edicao.capa ? (
                    <img
                        src={edicao.capa}
                        onError={() => setImageError(true)}
                        alt={`Capa de ${livro.titulo}`}
                        className="
                            absolute inset-0
                            w-full h-full
                            object-cover
                            rounded-xl
                        "
                    />
                ) : (
                    <div className="
                        absolute inset-0
                        flex items-center justify-center
                        border border-black
                        dark:border-white
                        rounded-xl
                        text-text-muted
                        dark:text-text-light
                    ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            fill="currentColor"
                            className="
                                bi bi-book
                                text-black dark:text-white
                                sm:size-20
                            "
                            viewBox="0 0 16 16"
                        >
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                        </svg>
                    </div>
                )}

                {/* INDISPONIBILIDADE */}
                {!disponivel && (
                    <div className="flex size-full justify-center items-end absolute inset-0 bg-black/80 pb-5 rounded-xl">
                        <p className="font-baloo-tamma text-2xl text-white text-center font-bold">Indisponível</p>
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
        </article>
    );

    if (onAbrirLivro) {
        return (
            <button
                type="button"
                onClick={() => onAbrirLivro(livro.id, edicao.id)}
                className="block w-36 shrink-0 text-left"
            >
                {conteudo}
            </button>
        );
    }

    return (
        <Link
            to={`/detalhes-livro/${edicao.id}`}
            className="block w-36 shrink-0"
        >
            {conteudo}
        </Link>
    );
}

export default function LivrosRecomendados({
    livros,
    onAbrirLivro
}: LivrosRecomendadosProps) {
    if (livros.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="
                mb-4 text-base font-bold
                font-ubuntu
                text-dark-blue
                dark:text-light-blue-logo
            ">
                Conteúdos semelhantes a este
            </h2>

            <div className="
                flex gap-4
                overflow-x-auto
                pb-3
                scrollbar-thin
            ">
                {livros.map(({ livro, edicao }) => (
                    <LivroRecomendadoCard
                        key={edicao.id}
                        livro={livro}
                        edicao={edicao}
                        onAbrirLivro={onAbrirLivro}
                    />
                ))}
            </div>
        </section>
    );
}
