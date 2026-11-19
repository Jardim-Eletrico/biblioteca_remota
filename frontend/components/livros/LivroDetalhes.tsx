import { useEffect, useState } from "react";

import AvaliacaoMedia from "./AvaliacaoMedia";
import DescricaoLivro from "./DescricaoLivro";
import LivrosRecomendados from "./LivrosRecomendados";

import type {
    LivroResponse,
    LivroComEdicoes
} from "@/src/types/livro";

import type { EdicaoResponse } from "@/src/types/edicao";
import type { ItemCarrinho } from "@/src/types/carrinho";

import {
    listarItensCarrinho,
    adicionarItemCarrinho,
    removerItemCarrinho
} from "@/src/services/carrinhoService";

interface LivroDetalhesProps {
    livro: LivroResponse;
    edicao: EdicaoResponse;
    recomendados?: LivroComEdicoes[];

    // Integração com a lista de desejos
    estaNaListaDesejos?: boolean;
    onAlternarDesejo?: () => void;

    // Navegação para outros livros
    onAbrirLivroRecomendado?: (
        livroId: number,
        edicaoId: number
    ) => void;
}

export default function LivroDetalhes({
    livro,
    edicao,
    recomendados = [],
    estaNaListaDesejos = false,
    onAlternarDesejo,
    onAbrirLivroRecomendado
}: LivroDetalhesProps) {

    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [carregandoCarrinho, setCarregandoCarrinho] = useState(true);
    const [processandoCarrinho, setProcessandoCarrinho] = useState(false);
    const [erroCarregamento, setErroCarregamento] = useState(false);

    const [mensagem, setMensagem] = useState<string | null>(null);
    const [tipoMensagem, setTipoMensagem] = useState<
        "sucesso" | "erro" | null
    >(null);

    // BUSCAR ITENS DO CARRINHO
    useEffect(() => {
        async function carregarCarrinho() {
            try {
                const dados = await listarItensCarrinho();
                setItens(dados);
            } catch (error) {
                setErroCarregamento(true);
                setTipoMensagem("erro");
                setMensagem(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar o carrinho."
                );
            } finally {
                setCarregandoCarrinho(false);
            }
        }

        carregarCarrinho();
    }, []);

    // VERIFICAR SE O LIVRO JÁ ESTÁ NO CARRINHO
    const itemNoCarrinho = itens.find(
        (item) => item.livroId === livro.id
    );

    const livroJaAdicionado = !!itemNoCarrinho;

    // VERIFICAR LIMITE DE LIVROS
    const limiteAtingido = itens.length >= 2;

    // VERIFICAR DISPONIBILIDADE DA EDIÇÃO
    const temDisponibilidade =
        edicao.exemplares_disponiveis > 0;

    // ADICIONAR OU REMOVER DO CARRINHO
    async function adicionarAoCarrinho() {
        if (processandoCarrinho || carregandoCarrinho || erroCarregamento) {
            return;
        }

        setProcessandoCarrinho(true);

        try {
            // SE JÁ ESTÁ NO CARRINHO, REMOVER
            if (itemNoCarrinho) {
                await removerItemCarrinho(itemNoCarrinho.id);

                setItens((anteriores) =>
                    anteriores.filter(
                        (item) => item.id !== itemNoCarrinho.id
                    )
                );

                setTipoMensagem("sucesso");
                setMensagem("Livro removido do carrinho!");
                return;
            }

            if (!temDisponibilidade) {
                setTipoMensagem("erro");
                setMensagem("Esta edição não possui exemplares disponíveis.");
                return;
            }

            if (limiteAtingido) {
                setTipoMensagem("erro");
                setMensagem("Você só pode adicionar 2 livros ao carrinho.");
                return;
            }

            const novoItem = await adicionarItemCarrinho(edicao.id);

            setItens((anteriores) => [
                ...anteriores,
                novoItem
            ]);

            setTipoMensagem("sucesso");
            setMensagem("Livro adicionado ao carrinho!");

        } catch (error) {
            setTipoMensagem("erro");
            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar o carrinho."
            );
        } finally {
            setProcessandoCarrinho(false);
        }
    }

    return (
        <main className="
            mx-auto w-full max-w-5xl
            px-3 py-4
            sm:px-5 sm:py-6
        ">
            {/* CAPA */}
            <div className="
                w-full
                overflow-hidden rounded-xl
                border border-gray-stroke
                bg-light-gray
                dark:border-surface-mid
                dark:bg-surface-mid
            ">
                {edicao.capa ? (
                    <img
                        src={edicao.capa}
                        alt={`Capa de ${livro.titulo}`}
                        className="
                            block w-full
                            aspect-[2/3]
                            max-h-[650px]
                            object-cover
                        "
                    />
                ) : (
                    <div className="
                        flex aspect-[2/3]
                        max-h-[500px]
                        items-center justify-center
                        text-text-muted
                        dark:text-text-light
                    ">
                        Capa indisponível
                    </div>
                )}
            </div>

            {/* TÍTULO E LISTA DE DESEJOS */}
            <div className="
                mt-2 flex items-start
                justify-between gap-3
            ">
                <div className="min-w-0 flex-1">
                    <h1 className="
                        text-xl font-bold
                        font-space-grotesk
                        text-book-title
                        dark:text-text-light
                    ">
                        {livro.titulo}
                    </h1>
                    <p className="
                        text-sm font-ubuntu
                        text-text-muted
                        dark:text-text-light
                    ">
                        {livro.autor}
                    </p>
                </div>

                {/* LISTA DE DESEJOS */}
                <button
                    type="button"
                    onClick={onAlternarDesejo}
                    disabled={!onAlternarDesejo}
                    aria-label={
                        estaNaListaDesejos
                            ? "Remover da lista de desejos"
                            : "Adicionar à lista de desejos"
                    }
                    aria-pressed={estaNaListaDesejos}
                    className="
                        mt-1 shrink-0
                        text-primary
                        transition-transform
                        hover:scale-110
                        disabled:cursor-default
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        fill={estaNaListaDesejos ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 3.75h12a1 1 0 0 1 1 1v16l-7-4-7 4v-16a1 1 0 0 1 1-1Z"/>
                    </svg>
                </button>
            </div>

            {/* AVALIAÇÃO MÉDIA */}
            <div className="mt-1">
                <AvaliacaoMedia
                    media={livro.media_avaliacoes}
                    quantidade={livro.quantidade_avaliacoes}
                />
            </div>

            {/* ADICIONAR AO CARRINHO */}
            <button
                type="button"
                onClick={adicionarAoCarrinho}
                disabled={
                    carregandoCarrinho ||
                    processandoCarrinho ||
                    erroCarregamento ||
                    (!livroJaAdicionado && (!temDisponibilidade || limiteAtingido))
                }
                className="
                    mt-6 w-full rounded-xl
                    bg-primary
                    px-5 py-3
                    font-semibold
                    text-light-blue-logo
                    transition-opacity
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {carregandoCarrinho
                    ? "CARREGANDO CARRINHO..."
                    : processandoCarrinho
                        ? "AGUARDE..."
                        : livroJaAdicionado
                            ? "REMOVER DO CARRINHO"
                            : limiteAtingido
                                ? "LIMITE DE 2 LIVROS ATINGIDO"
                                : !temDisponibilidade
                                    ? "INDISPONÍVEL"
                                    : "ADICIONAR AO CARRINHO"
                }
            </button>

            {/* MENSAGEM */}
            {mensagem && (
                <p className={`mt-2 text-sm ${
                    tipoMensagem === "sucesso"
                        ? "text-avaiable-green"
                        : "text-warning"
                }`}>
                    {mensagem}
                </p>
            )}

            {/* DESCRIÇÃO */}
            <DescricaoLivro descricao={livro.descricao} />

            {/* RECOMENDAÇÕES */}
            <LivrosRecomendados
                livros={recomendados}
                onAbrirLivro={onAbrirLivroRecomendado}
            />
        </main>
    );
}