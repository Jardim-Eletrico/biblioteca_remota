
import { useEffect, useState } from "react";

import DesejoCard from "@/components/desejo/DesejoCard";
import {
    listarDesejos,
    removerDesejo as removerDesejoApi
} from "@/src/services/desejoService";

import type { ListaDesejoResponse } from "@/src/types/desejo";
import Loader from "@/components/app/loader_animation/loader";

export default function TesteDesejoCard() {
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
        <div>
            <div className="mx-auto">

                {/* Cabeçalho */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white">
                            Lista de desejos
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500">
                            {desejos.length} livros na sua lista
                        </p>
                    </div>
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
                        <div className="
                            grid grid-cols-1 gap-5
                            md:grid-cols-2 relative
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
                    ) : (
                        <p className="py-12 text-center text-zinc-500">
                            Sua lista de desejos está vazia.
                        </p>
                    )
                )}

            </div>
        </div>
    );
}
