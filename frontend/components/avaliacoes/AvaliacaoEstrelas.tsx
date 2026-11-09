
interface AvaliacaoEstrelasProps {
    nota: number;
    onChange: (nota: number) => void;
    disabled?: boolean;
}

export default function AvaliacaoEstrelas({
    nota,
    onChange,
    disabled = false
}:AvaliacaoEstrelasProps) {
    return(
        <div
            className="flex items-center justify-center gap-2"
            role="radiogroup"
            aria-label="Avaliação do livro"
        >

            {[1, 2, 3, 4, 5].map((estrela) => {
                const selecionada = estrela <= nota;

                return (
                    <button
                    key={estrela}
                    type="button"
                    role="radio"
                    aria-checked={nota === estrela}
                    arial-label = {`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
                    disabled={disabled}
                    onClick={() => onChange(estrela)}
                    className="
                    transition-transform duration-200
                    hover:scale-110
                    disabled: cursor-not-allowed
                    disabled:opacity-50
                    ">

                        <img src={selecionada ? "/SVGs/star-fill.svg" : "/SVGs/star.svg"}
                        alt=""
                        aria-hidden="true"
                        className="w-8 h-8"
                        draggable={false}
                        />
                    </button>
                )
            })}

        </div>
    )
}