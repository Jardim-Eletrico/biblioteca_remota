import type { ListaDesejoResponse } from "@/src/types/desejo";

interface DesejoCardProps {
    desejo: ListaDesejoResponse;
    onRemover: (id: number) => void;
    onDetalhes: (id: number) => void;
}


export default function DesejoCard(
    {
        desejo,
        onRemover,
        onDetalhes,
    }:DesejoCardProps
){
    return(
        <>
        <article className="flex items-center gap-5
        rounded-3xl bg-white p-4 shadow-md
        transition-shadow hover:shadow-lg">

            <div className="h-48 w-36 shrink-0 overflow-hidden rounded-2xl">
                <img
                src={desejo.capa ?? ''}
                alt={`Capa de ${desejo.titulo}`}
                className="h-full w-full object-cover"/>
            </div>

            <div className="min w-0 flex-1">

                <div className="flex items-start justify-between gap-2">
                    
                    <h2 className="truncate text-x1 font-bold text-gray-900">
                        {desejo.titulo}
                    </h2>

                    <button 
                        type="button"
                        onClick={() => onRemover(desejo.id)}></button>
                </div>

            </div>
        </article>
        </>
    );
}