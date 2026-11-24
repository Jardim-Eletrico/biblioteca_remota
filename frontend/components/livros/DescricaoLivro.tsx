
import { useEffect, useRef, useState } from "react";

interface DescricaoLivroProps {
    descricao: string | null;
}

export default function DescricaoLivro({
    descricao
}: DescricaoLivroProps) {

    const [expandida, setExpandida] = useState(false);
    const [podeExpandir, setPodeExpandir] = useState(false);

    const textoRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const elemento = textoRef.current;

        if (!elemento) return;

        function verificarAltura() {
            if (!elemento) return;

            const estilo = window.getComputedStyle(elemento);
            const lineHeight = parseFloat(estilo.lineHeight);

            const quantidadeLinhas = Math.round(
                elemento.scrollHeight / lineHeight
            );

            setPodeExpandir(quantidadeLinhas > 4);
        }

        verificarAltura();

        window.addEventListener("resize", verificarAltura);

        return () => {
            window.removeEventListener("resize", verificarAltura);
        };
    }, [descricao]);

    useEffect(() => {
        setExpandida(false);
    }, [descricao]);

    if (!descricao) return null;

    return (
        <section className="mt-5 w-full transition-all duration-150">

            <div className="relative w-full transition-all duration-150">

                <p
                    ref={textoRef}
                    className={`
                        text-sm leading-relaxed
                        font-roboto
                        text-text-muted
                        dark:text-text-light
                        md:text-[20px] w-full
                        overflow-hidden
                        transition-[max-height] duration-250 ease-in-out
                    `}
                    style={{
                        maxHeight: expandida ? `${textoRef.current?.scrollHeight}px` : "6em"
                    }}
                >
                    {descricao}
                </p>

                {!expandida && podeExpandir && (
                    <div
                        className="
                            pointer-events-none
                            absolute bottom-0 left-0
                            h-20 w-full
                            bg-linear-to-t
                            from-gray-background
                            to-transparent
                            dark:from-gray-900
                            transition-opacity duration-1050
                        "
                    />
                )}

            </div>

            {podeExpandir && (
                <button
                    type="button"
                    onClick={() => setExpandida(prev => !prev)}
                    aria-expanded={expandida}
                    className="
                        mt-2 flex items-center gap-1
                        text-sm font-medium
                        text-primary
                        hover:opacity-80
                    "
                >
                    {expandida ? "Ver menos" : "Ver descrição completa"}

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`
                            h-4 w-4 transition-transform duration-300
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
