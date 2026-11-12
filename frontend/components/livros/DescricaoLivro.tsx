import { useState } from "react";

interface DescricaoLivroProps {
    descricao: string | null;
}

export default function DescricaoLivro({
    descricao
}: DescricaoLivroProps) {

    const [expandida, setExpandida] = useState(false);

    if (!descricao) {
        return null;
    }

    const podeExpandir = descricao.length > 180;

    return (
        <section className="mt-5">

            {/* TEXTO */}
            <div className="relative">

                <p
                    className={`
                        text-sm leading-relaxed
                        font-roboto
                        text-text-muted
                        dark:text-text-light
                        ${!expandida && podeExpandir ? "line-clamp-4" : ""}
                    `}
                >
                    {descricao}
                </p>

                {/* EFEITO DE ESMAECIMENTO */}
                {!expandida && podeExpandir && (
                    <div className="
                        pointer-events-none
                        absolute bottom-0 left-0
                        h-10 w-full
                        bg-gradient-to-t
                        from-gray-background
                        to-transparent
                        dark:from-surface-dark
                    "/>
                )}

            </div>

            {/* EXPANDIR / RECOLHER */}
            {podeExpandir && (
                <button
                    type="button"
                    onClick={() => setExpandida(!expandida)}
                    aria-expanded={expandida}
                    className="
                        mt-2 flex items-center gap-1
                        text-sm font-medium
                        text-primary
                        hover:opacity-80
                    "
                >
                    {expandida
                        ? "Ver menos"
                        : "Ver descrição completa"
                    }

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`
                            h-4 w-4 transition-transform
                            ${expandida ? "rotate-180" : ""}
                        `}
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}

        </section>
    );
}