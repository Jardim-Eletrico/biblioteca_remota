
interface AvaliacaoMediaProps {
    media: number | null;
    quantidade: number;
}

export default function AvaliacaoMedia({
    media,
    quantidade
}: AvaliacaoMediaProps) {

    if (media === null || quantidade === 0) {
        return (
            <p className="
                text-sm text-text-muted
                dark:text-text-light
            ">
                Ainda não avaliado
            </p>
        );
    }

    // Arredondar para o intervalo de meia estrela
    const mediaArredondada = Math.round(media * 2) / 2;

    return (
        <div className="flex items-center gap-1.5">

            {/* ESTRELAS */}
            <div className="flex items-center gap-0.5">

                {[1, 2, 3, 4, 5].map((estrela) => {

                    let icone = "star.svg";

                    if (mediaArredondada >= estrela) {
                        icone = "star-fill.svg";
                    } else if (mediaArredondada >= estrela - 0.5) {
                        icone = "star-half.svg";
                    }

                    return (
                        <span
                            key={estrela}
                            className="
                                block h-4 w-4
                                shrink-0 bg-primary
                            "
                            style={{
                                maskImage: `url("/SVGs/${icone}")`,
                                WebkitMaskImage: `url("/SVGs/${icone}")`,
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain"
                            }}
                        />
                    );
                })}

            </div>

            {/* MÉDIA */}
            <span className="
                text-sm font-medium
                text-primary
            ">
                {media.toFixed(1)}
            </span>

            {/* QUANTIDADE */}
            <span className="
                text-xs text-text-muted
                dark:text-text-light
            ">
                ({quantidade})
            </span>

        </div>
    );
}
