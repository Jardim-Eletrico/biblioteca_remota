import { useState } from "react";

type CardProps = {
    autor: string,
    titulo: string,
    image: string
}

export default function LivroCard( { autor, titulo, image }: CardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex flex-col items-center w-full h-fit gap-0.75">
            {!imageError && image ? (
                <img
                    src={image}
                    onError={() => setImageError(true)}
                    className="w-full aspect-3/4 bg-cover rounded-xl object-cover"
                    alt={`Capa de ${titulo}`}
                />
            ) : (
                <div className="flex w-full aspect-3/4 items-center justify-center border border-black dark:border-white rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-book text-black dark:text-white sm:size-20" viewBox="0 0 16 16">
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                    </svg>
                </div>
            )}
            <p className="font-ubuntu font-medium text-[1rem] text-left w-full dark:text-white">{titulo}</p>
            <p className="font-ubuntu font-medium text-[0.8rem] text-left w-full text-text-muted">{autor}</p>
        </div>
    )
}