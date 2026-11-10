
interface AvaliacaoEstrelasProps {
    nota: number;
    onChange: (nota: number) => void;
    disabled?: boolean;
}

export default function AvaliacaoEstrelas({
    nota,
    onChange,
    disabled = false
}: AvaliacaoEstrelasProps) {

    return (
        <div
            className="flex items-center justify-center gap-3"
            role="radiogroup"
            aria-label="Avaliação do livro"
        >
            {[1, 2, 3, 4, 5].map((estrela) => {

                const selecionada = estrela <= nota;

                const icone = selecionada
                    ? "/SVGs/star-fill.svg"
                    : "/SVGs/star.svg";

                return (
                    <button
                        key={estrela}
                        type="button"
                        role="radio"
                        aria-checked={nota === estrela}
                        aria-label={`${estrela} estrelas`}
                        disabled={disabled}
                        onClick={() => onChange(estrela)}
                        className="
                            cursor-pointer
                            transition-transform duration-200
                            hover:scale-110
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <span
                            className="block h-9 w-9 bg-primary"
                            style={{
                                maskImage: `url("${icone}")`,
                                WebkitMaskImage: `url("${icone}")`,
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain"
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
}
