import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ItemCarrinho } from "@/src/types/carrinho";

interface ItemCarrinhoProps {
    item: ItemCarrinho;
    onRemover: (itemId: number) => Promise<void> | null;
    
}

export default function ItemCarrinhoCard({
    item,
    onRemover,
}: ItemCarrinhoProps) {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    return (
        <article className="
            relative flex items-center gap-4
            rounded-2xl bg-white p-3 shadow-md
            text-black
            dark:bg-zinc-800 dark:text-white w-full h-full
        ">

            {/* Remover item */}
            <button
                type="button"
                onClick={() => onRemover(item.id)}
                aria-label={`Remover ${item.titulo} do carrinho`}
                className="
                    absolute right-3 top-2
                    text-2xl leading-none
                    text-zinc-700 hover:text-red-500
                    dark:text-zinc-300 dark:hover:text-red-400
                    transition-colors
                "
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x dark:text-white" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </button>

            {/* Capa */}
            <div className="
                w-45 overflow-hidden
                rounded-lg bg-zinc-100
                dark:bg-zinc-700
            ">
                {!imageError && item.capa ? (
                    <img
                        src={item.capa}
                        onError={() => setImageError(true)}
                        alt={`Capa de ${item.titulo}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="
                        flex h-full w-full items-center justify-center
                        border border-black dark:border-white
                        rounded-lg
                    ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            fill="currentColor"
                            className="bi bi-book text-black dark:text-white"
                            viewBox="0 0 16 16"
                        >
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                        </svg>
                    </div>
                )}
            </div>

            {/* Informações */}
            <div className="flex flex-col min-w-0 w-full gap-3 items-start h-full">
                
                <div className="flex flex-col gap-0.5 w-full">

                    <h3 className="
                        pr-5 text-sm font-semibold w-full max-w-[90%] truncate md:text-2xl
                    ">
                        {item.titulo}
                    </h3>

                    <p className="
                        truncate text-xs text-zinc-500
                        dark:text-zinc-400 w-full max-w-[90%] md:text-[18px]
                    ">
                        {item.editora}
                    </p>

                </div>

                {/* Classificação CDD */}
                {item.cdd && (
                    <span className="
                        inline-block max-w-full
                        truncate rounded-md
                        bg-blue-100 px-2 py-1
                        text-xs font-medium text-blue-700
                        dark:bg-blue-900/40 dark:text-blue-300 md:text-[16px]
                    ">
                        {item.cdd}
                    </span>
                )}

                {/* Disponibilidade */}
                {item.exemplaresDisponiveis > 0 ? (
                    <span className="
                        inline-flex items-center gap-1
                        rounded-md bg-green-100
                        px-2 py-1 text-xs font-medium
                        text-green-700
                        dark:bg-green-900/40 dark:text-green-300 md:text-[16px]
                    ">
                        <span className="h-2 w-2 rounded-full bg-green-600" />
                        {item.exemplaresDisponiveis} exemplares disponíveis
                    </span>
                ) : (
                    <span className="
                        inline-flex items-center gap-1
                        rounded-md bg-amber-100
                        px-2 py-1 text-xs font-medium
                        text-amber-700
                        dark:bg-amber-900/40 dark:text-amber-300 md:text-[16px]
                    ">
                        <span className="h-2 w-2 rounded-full bg-amber-600" />
                        Indisponível
                    </span>
                )}

                {item.exemplaresDisponiveis <= 0 && (
                    <div className="flex items-center justify-center bg-red-100 text-red-500 border-dashed border-red-500 border-2 p-2 md:p-3 rounded-lg relative">
                        <p className="text-[12px] md:text-[16px]">Este item está indisponível. Remova-o do carrinho antes de continuar</p>
                    </div>
                )}

                <button
                    type="button"
                    className="
                        w-full rounded-lg
                        border border-blue-600
                        py-2 text-sm font-semibold
                        text-blue-600
                        hover:bg-blue-600 hover:text-white
                        transition-colors
                        dark:border-blue-500
                        dark:text-blue-400
                        dark:hover:bg-blue-600
                        dark:hover:text-white self-end mt-auto md:text-[20px]
                    "
                    onClick={() => {navigate(`/detalhes-livro/${item.edicaoId}`); }}
                >
                    DETALHES
                </button>
            </div>
        </article>
    );
}
