
import { useEffect, useState } from "react";

import DesejoCard from "@/components/desejo/DesejoCard";
import {
    listarDesejos,
    removerDesejo as removerDesejoApi
} from "@/src/services/desejoService";

import type { ListaDesejoResponse } from "@/src/types/desejo";
import Loader from "@/components/app/loader_animation/loader";

export default function PageDesejoCard() {
    const [desejos, setDesejos] = useState<ListaDesejoResponse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Buscar desejos da API
    async function carregarDesejos() {
        try {
            setCarregando(true);
            setErro(null);

            const dados = await listarDesejos();

            setDesejos(dados);

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar os desejos."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarDesejos();
    }, []);

    // Remover desejo e atualizar a lista
    async function removerDesejo(edicaoId: number) {
        try {
            await removerDesejoApi(edicaoId);

            await carregarDesejos();

        } catch (error) {
            console.error("Erro ao remover desejo:", error);

            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao remover desejo."
            );
        }
    }

    function reservarEdicao(edicaoId: number) {
        alert(`Edição selecionada: ${edicaoId}`);
    }

    return (
        <>
            <div className="flex flex-col items-center w-full gap-5">

                {/* Cabeçalho */}
                <div className="flex items-center gap-0.5 w-full">
                    <div className="w-1 h-4.5 bg-primary rounded-[10px]" />
                    <span className="font-space-grotesk text-[16px] font-semibold dark:text-white">Lista de desejos</span>
                </div>

                {/* Carregamento */}
                {carregando && (
                    <div className="flex col-span-2 sm:col-span-3 justify-center items-center w-full">
                        <Loader />
                    </div>
                )}

                {/* Erro */}
                {erro && (
                    <p className="text-center text-red-500">
                        {erro}
                    </p>
                )}

                {/* Lista */}
                {!carregando && !erro && (
                    desejos.length > 0 ? (
                        <>
                            <div className="flex items-center w-full h-fit px-3 py-5 gap-3.5 bg-white dark:bg-zinc-800 shadow-md rounded-3xl">

                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-book text-primary" viewBox="0 0 16 16">
                                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                                </svg>

                                <span className="font-ubuntu text-[18px] font-bold dark:text-white">
                                    {desejos.length} livros na sua lista de desejos
                                </span>

                            </div>
                        
                            <div className="
                                grid grid-cols-1 gap-5
                                md:grid-cols-2 w-full relative
                            ">

                                {desejos.map((desejo) => (
                                    <DesejoCard
                                        key={desejo.id}
                                        desejo={desejo}
                                        onReservar={reservarEdicao}
                                        onRemover={removerDesejo}
                                    />

                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="py-12 text-center text-zinc-500">
                            Sua lista de desejos está vazia.
                        </p>
                    )
                )}

            </div>
        </>
    );
}
