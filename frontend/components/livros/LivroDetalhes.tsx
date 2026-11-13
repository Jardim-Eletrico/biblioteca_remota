
import { useState } from "react";

import { useCarrinho } from "@/src/contexts/carrinhoContext";

import AvaliacaoMedia from "./AvaliacaoMedia";
import DescricaoLivro from "./DescricaoLivro";
import LivrosRecomendados from "./LivrosRecomendados";

import type {
    LivroResponse,
    LivroComEdicao
} from "@/src/types/livro";

import type { EdicaoResponse } from "@/src/types/edicao";

interface LivroDetalhesProps {
    livro: LivroResponse;
    edicao: EdicaoResponse;
    recomendados?: LivroComEdicao[];

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

    const {
        itens,
        adicionarItem,
        removerItem,
    } = useCarrinho();

    const [mensagem, setMensagem] = useState<string | null>(null);

    const [tipoMensagem, setTipoMensagem] = useState<
        "sucesso" | "erro" | null
    >(null);

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

    // ADICIONAR AO CARRINHO
    function adicionarAoCarrinho() {

    // SE JÁ ESTÁ NO CARRINHO, REMOVER
    if (itemNoCarrinho) {

        removerItem(itemNoCarrinho.edicaoId);

        setTipoMensagem("sucesso");
        setMensagem("Livro removido do carrinho!");

        return;
    }

    if (!temDisponibilidade) {
        setTipoMensagem("erro");
        setMensagem(
            "Esta edição não possui exemplares disponíveis."
        );
        return;
    }

    if (limiteAtingido) {
        setTipoMensagem("erro");
        setMensagem(
            "Você só pode adicionar 2 livros ao carrinho."
        );
        return;
    }

    adicionarItem({
        edicaoId: edicao.id,
        livroId: livro.id,
        titulo: livro.titulo,
        editora: edicao.editora,
        capa: edicao.capa,
        exemplaresDisponiveis:
            edicao.exemplares_disponiveis
    });

    setTipoMensagem("sucesso");
    setMensagem("Livro adicionado ao carrinho!");
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
                        fill={
                            estaNaListaDesejos
                                ? "currentColor"
                                : "none"
                        }
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
                    media={livro.media_avalicoes}
                    quantidade={livro.quantidade_avaliacoes}
                />

            </div>


            {/* ADICIONAR AO CARRINHO */}
            <button
                type="button"
                onClick={adicionarAoCarrinho}
                disabled={
                    !livroJaAdicionado && (!temDisponibilidade || limiteAtingido)
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
                {livroJaAdicionado
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
                <p className={`
                    mt-2 text-sm
                    ${tipoMensagem === "sucesso"
                        ? "text-avaiable-green"
                        : "text-warning"
                    }
                `}>
                    {mensagem}
                </p>
            )}


            {/* DESCRIÇÃO */}
            <DescricaoLivro
                descricao={livro.descricao}
            />


            {/* RECOMENDAÇÕES */}
            <LivrosRecomendados
                livros={recomendados}
                onAbrirLivro={onAbrirLivroRecomendado}
            />

        </main>
    );
}
