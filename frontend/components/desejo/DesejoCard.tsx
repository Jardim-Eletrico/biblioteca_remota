
import type { ListaDesejoResponse } from "@/src/types/desejo";

interface DesejoCardProps {
    desejo: ListaDesejoResponse;
    onReservar: (edicaoId: number) => void;
    onRemover: (desejoId: number) => void;
}

export default function DesejoCard({
    desejo,
    onReservar,
    onRemover
}: DesejoCardProps) {
    return (
        <article className="
            relative flex items-center gap-4
            rounded-2xl bg-white p-3 shadow-md
            text-black
            dark:bg-zinc-800 dark:text-white
        ">

            {/* Remover desejo */}
            <button
                type="button"
                onClick={() => onRemover(desejo.id)}
                aria-label={`Remover ${desejo.titulo} da lista de desejos`}
                className="
                    absolute right-3 top-2
                    text-2xl leading-none
                    text-zinc-700 hover:text-red-500
                    dark:text-zinc-300 dark:hover:text-red-400
                    transition-colors
                "
            >
                ×
            </button>

            {/* Capa */}
            <div className="
                h-36 w-24 shrink-0 overflow-hidden
                rounded-lg bg-zinc-100
                dark:bg-zinc-700
            ">
                {desejo.capa ? (
                    <img
                        src={desejo.capa}
                        alt={`Capa de ${desejo.titulo}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="
                        flex h-full items-center justify-center
                        text-center text-xs text-zinc-500
                        dark:text-zinc-300
                    ">
                        Sem capa
                    </div>
                )}
            </div>

            {/* Informações */}
            <div className="min-w-0 flex-1 pr-0">

                <h3 className="
                    truncate pr-5 text-sm font-semibold
                ">
                    {desejo.titulo}
                </h3>

                <p className="
                    mt-1 truncate text-xs text-zinc-500
                    dark:text-zinc-400
                ">
                    {desejo.autor}
                </p>

                {/* Classificação CDD */}
                {desejo.cdd && (
                    <span className="
                        mt-2 inline-block max-w-full
                        truncate rounded-md
                        bg-blue-100 px-2 py-1
                        text-xs font-medium text-blue-700
                        dark:bg-blue-900/40 dark:text-blue-300
                    ">
                        {desejo.cdd}
                    </span>
                )}

                {/* Disponibilidade */}
                <div className="mt-2">
                    {desejo.tem_exemplares_disponiveis ? (
                        <span className="
                            inline-flex items-center gap-1
                            rounded-md bg-green-100
                            px-2 py-1 text-xs font-medium
                            text-green-700
                            dark:bg-green-900/40 dark:text-green-300
                        ">
                            <span className="h-2 w-2 rounded-full bg-green-600" />
                            Disponível
                        </span>
                    ) : (
                        <span className="
                            inline-flex items-center gap-1
                            rounded-md bg-amber-100
                            px-2 py-1 text-xs font-medium
                            text-amber-700
                            dark:bg-amber-900/40 dark:text-amber-300
                        ">
                            <span className="h-2 w-2 rounded-full bg-amber-600" />
                            Indisponível
                        </span>
                    )}
                </div>

                {/* Reservar */}
                <button
                    type="button"
                    onClick={() => onReservar(desejo.edicao)}
                    className="
                        mt-2 w-full rounded-lg
                        border border-blue-600
                        py-1 text-sm font-semibold
                        text-blue-600
                        hover:bg-blue-600 hover:text-white
                        transition-colors
                        dark:border-blue-500
                        dark:text-blue-400
                        dark:hover:bg-blue-600
                        dark:hover:text-white
                    "
                >
                    RESERVAR
                </button>

            </div>
        </article>
    );
}
