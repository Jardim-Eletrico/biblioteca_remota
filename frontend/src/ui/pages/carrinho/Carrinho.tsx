import { useEffect, useState } from "react";

import type { ItemCarrinho } from "@/src/types/carrinho";
import { listarItensCarrinho, removerItemCarrinho } from "@/src/services/carrinhoService";
import ItemCarrinhoCard from "@/components/carrinho/carrinhoCard";
import Loader from "@/components/app/loader_animation/loader";

import LivrosRecomendados from "@/components/livros/LivrosRecomendados";
import type { LivroRecomendadoResponse } from "@/src/types/livro";

import { buscarLivrosRecomendados } from "@/src/services/livrosService";

interface CarrinhoProps {
    recomendados?: LivroRecomendadoResponse[];
}

export default function Carrinho(
    {
        recomendados,
    }: CarrinhoProps)
 {

    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [recomendacoesApi, setRecomendacoesApi] = useState<LivroRecomendadoResponse[]>([]);

    useEffect(() => {
        async function carregarCarrinho() {
            try {
                const dados = await listarItensCarrinho();
                setItens(dados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar carrinho."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarCarrinho();
    }, []);


    // CARREGAR RECOMENDAÇÕES
        useEffect(() => {
            if (recomendados !== undefined) {
                return;
            }

            const livroIds = itens.map((item) => item.livroId);

            if (livroIds.length === 0) {
                setRecomendacoesApi([]);
                return;
            }

            let ativo = true;

            async function carregarRecomendacoes() {
                try {
                    const dados = await buscarLivrosRecomendados(livroIds);

                    if (ativo) {
                        setRecomendacoesApi(dados);
                    }
                } catch (error) {
                    console.error("Erro ao carregar as recomendações:", error);

                    if (ativo) {
                        setRecomendacoesApi([]);
                    }
                }
            }

            carregarRecomendacoes();

            return () => {
                ativo = false;
            };
        }, [itens, recomendados]);
    
        const recomendacoesExibidas = recomendados ?? recomendacoesApi;


    if (carregando) {
        return (
            <div className="absolute inset-0 flex items-center justify-center scale-150">
                <Loader />
            </div>
        )
    }

    if (erro) {
        return <p>Erro: {erro}</p>;
    }

    async function removerItem(itemId: number) {
        try {
            await removerItemCarrinho(itemId);

            const dados = await listarItensCarrinho();
            setItens(dados);

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao remover item do carrinho."
            );
        }
    }

    return (
        <div className="flex flex-col items-center w-full gap-5">
            <div className="flex items-center gap-0.5 w-full">
                <div className="w-1 h-4.5 bg-primary rounded-[10px]" />
                <span className="font-space-grotesk text-[16px] font-semibold dark:text-white">Carrinho de livros</span>
            </div>
            
            
            <div className="
                grid grid-cols-1 gap-5
                md:grid-cols-3 w-full relative transition-transform duration-500 ease-in-out
            ">
                <div className="flex flex-col gap-5 md:col-span-2">
                {itens.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    
                    itens.map((item) => (
                        <article key={item.id} className="w-full">
                            <ItemCarrinhoCard item={item} onRemover={() => removerItem(item.id)} />
                        </article>
                    ))
                )}
                </div>

                <div className="
                    w-full rounded-2xl
                    bg-white dark:bg-zinc-800
                    p-4 shadow-md
                    flex flex-col gap-4 md:col-span-1 justify-between
                ">
                    {/* Cabeçalho */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="
                            flex items-center justify-center
                            w-22 h-22 shrink-0
                            rounded-xl
                            bg-blue-50 dark:bg-blue-950/40
                            text-primary md:order-1
                        ">
                            {/* SVG permanece igual */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="47"
                                height="47"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                            </svg>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <span className="
                                text-xs font-semibold tracking-wider
                                text-gray-500 dark:text-gray-400 
                            ">
                                SEU CARRINHO
                            </span>
                        </div>
                    </div>

                    {/* Informações inferiores */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <span className="
                                    text-lg font-bold
                                    text-gray-800 dark:text-white
                                ">
                                    {itens.length} {itens.length === 1 ? "livro" : "livros"}
                                </span>

                                <span className="
                                    text-xs text-gray-500 dark:text-gray-400
                                ">
                                    {itens.length === 2
                                        ? "Limite de livros atingido"
                                        : "Disponíveis para reserva"}
                                </span>
                            </div>

                            <span className="
                                rounded-full px-3 py-1
                                text-xs font-bold
                                bg-blue-50 text-blue-600
                                dark:bg-blue-950/50 dark:text-blue-400
                            ">
                                {itens.length}/2
                            </span>
                        </div>

                        <div className="
                            w-full h-1.5 rounded-full
                            bg-gray-100 dark:bg-zinc-700
                            overflow-hidden
                        ">
                            <div
                                className="
                                    h-full rounded-full
                                    bg-primary transition-all duration-900
                                "
                                style={{
                                    width: `${Math.min(itens.length / 2, 1) * 100}%`
                                }}
                            />
                        </div>

                        <button
                            type="button"
                            className="
                                w-full rounded-xl
                                bg-primary py-3
                                text-sm font-bold text-white
                                transition-all duration-200
                                hover:brightness-110
                                active:scale-[0.98]
                            "
                        >
                            RESERVAR LIVROS
                        </button>
                    </div>
                </div>
                
                <div className="md:block md:col-span-3">
                    <LivrosRecomendados
                        livros={recomendacoesExibidas}
                    />
                </div>
            </div>
        </div>
    );
}
