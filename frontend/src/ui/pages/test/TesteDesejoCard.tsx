
import { useEffect, useState } from "react";

import DesejoCard from "@/components/desejo/DesejoCard";
import { listarDesejos } from "@/src/services/desejoService";

import type { ListaDesejoResponse } from "@/src/types/desejo";

export default function TesteDesejoCard() {
    const [temaEscuro, setTemaEscuro] = useState(false);

    const [desejos, setDesejos] = useState<ListaDesejoResponse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Buscar desejos da API
    useEffect(() => {
        async function carregarDesejos() {
            try {
                setCarregando(true);
                setErro(null);

                const dados = await listarDesejos();
                console.log("Capa retornada pela API:", dados[0]?.capa);

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

        carregarDesejos();
    }, []);

    // Remover apenas da visualização de teste
    function removerDesejo(id: number) {
        setDesejos((anteriores) =>
            anteriores.filter((desejo) => desejo.id !== id)
        );
    }

    function reservarEdicao(edicaoId: number) {
        alert(`Edição selecionada: ${edicaoId}`);
    }

    return (
        <div className={`
            min-h-screen p-6
            bg-slate-100 text-slate-900
            dark:bg-zinc-950 dark:text-white
            ${temaEscuro ? "dark" : ""}
        `}>

            <div className="mx-auto max-w-5xl">

                {/* Cabeçalho */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Lista de desejos
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {desejos.length} livros na sua lista
                        </p>
                    </div>


                </div>

                {/* Carregamento */}
                {carregando && (
                    <p className="text-center">
                        Carregando desejos...
                    </p>
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
                            md:grid-cols-2
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
