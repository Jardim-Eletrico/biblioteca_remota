import { useEffect, useState } from "react";

import AvaliacaoModal from "../avaliacoes/AvaliacaoModal";

import AvaliacaoMedia from "./AvaliacaoMedia";
import DescricaoLivro from "./DescricaoLivro";
import LivrosRecomendados from "./LivrosRecomendados";

import { buscarLivrosRecomendados } from "@/src/services/livrosService";
import { buscarPerfil } from "@/src/services/perfilService";

import { useNavigate } from "react-router-dom";

import {
    adicionarDesejo,
    listarDesejos,
    removerDesejo,
} from "@/src/services/desejoService";

import { consultarPermissaoAvaliacao } from "@/src/services/avaliacaoService";

import {
    listarItensCarrinho,
    adicionarItemCarrinho,
    removerItemCarrinho,
} from "@/src/services/carrinhoService";

import type { PerfilResponse } from "@/src/types/perfil";

import type {
    LivroResponse,
    LivroRecomendadoResponse,
} from "@/src/types/livro";

import type { EdicaoResponse } from "@/src/types/edicao";
import type { ItemCarrinho } from "@/src/types/carrinho";
import type { PermissaoAvaliacaoResponse } from "@/src/types/avaliacao";

interface LivroDetalhesProps {
    livro: LivroResponse;
    edicao: EdicaoResponse;
    recomendados?: LivroRecomendadoResponse[];

    estaNaListaDesejos?: boolean;
    onAlternarDesejo?: () => void;

    onAbrirLivroRecomendado?: (
        livroId: number,
        edicaoId: number
    ) => void;

    onAvaliacaoAtualizada?: () => void;
}

export default function LivroDetalhes({
    livro,
    edicao,
    recomendados,
    estaNaListaDesejos: estaNaListaDesejosProp,
    onAlternarDesejo,
    onAbrirLivroRecomendado,
    onAvaliacaoAtualizada,
}: LivroDetalhesProps) {
    const [imageError, setImageError] = useState(false);

    const [perfil, setPerfil] = useState<PerfilResponse | null>(null);

    const [mensagem, setMensagem] = useState<string | null>(null);

    const [tipoMensagem, setTipoMensagem] = useState<
        "sucesso" | "erro" | null
    >(null);

    const [recomendacoesApi, setRecomendacoesApi] = useState<
        LivroRecomendadoResponse[]
    >([]);

    const [desejoNaLista, setDesejoNaLista] = useState(false);
    const [atualizandoDesejo, setAtualizandoDesejo] = useState(false);

    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [carregandoCarrinho, setCarregandoCarrinho] = useState(true);
    const [atualizandoCarrinho, setAtualizandoCarrinho] = useState(false);
    const [erroCarrinho, setErroCarrinho] = useState(false);

    const [permissaoAvaliacao, setPermissaoAvaliacao] =
        useState<PermissaoAvaliacaoResponse | null>(null);

    const [carregandoPermissaoAvaliacao, setCarregandoPermissaoAvaliacao] =
        useState(false);

    const [modalAvaliacaoAberto, setModalAvaliacaoAberto] =
        useState(false);

    const ehLeitor = perfil?.leitor_id != null;

    const desejoAtivo = estaNaListaDesejosProp ?? desejoNaLista;

    const navigate = useNavigate();

    // IDENTIFICAR PERFIL DO USUÁRIO
    useEffect(() => {
        let ativo = true;

        async function carregarPerfil() {
            try {
                const dados = await buscarPerfil();

                if (ativo) {
                    setPerfil(dados);
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
                navigate("/error")
            }
        }

        carregarPerfil();

        return () => {
            ativo = false;
        };
    }, []);

    // CONSULTAR PERMISSÃO PARA AVALIAR O LIVRO
    useEffect(() => {
        if (!ehLeitor) {
            setPermissaoAvaliacao(null);
            setCarregandoPermissaoAvaliacao(false);
            return;
        }

        let ativo = true;

        async function carregarPermissaoAvaliacao() {
            try {
                setCarregandoPermissaoAvaliacao(true);

                const dados = await consultarPermissaoAvaliacao(livro.id);

                if (ativo) {
                    setPermissaoAvaliacao(dados);
                }
            } catch (error) {
                console.error(
                    "Erro ao consultar permissão de avaliação:",
                    error
                );

                if (ativo) {
                    setPermissaoAvaliacao(null);
                }
            } finally {
                if (ativo) {
                    setCarregandoPermissaoAvaliacao(false);
                }
            }
        }

        carregarPermissaoAvaliacao();

        return () => {
            ativo = false;
        };
    }, [livro.id, ehLeitor]);

    // ATUALIZAR PERMISSÃO APÓS AVALIAR
    async function atualizarPermissaoAvaliacao() {
        try {
            const dados = await consultarPermissaoAvaliacao(livro.id);

            setPermissaoAvaliacao(dados);
        } catch (error) {
            console.error(
                "Erro ao atualizar a permissão de avaliação:",
                error
            );
        }
    }

    // RESETAR ERRO DA CAPA AO TROCAR DE EDIÇÃO
    useEffect(() => {
        setImageError(false);
    }, [edicao.id]);

    // CARREGAR LISTA DE DESEJOS
    useEffect(() => {
        if (
            !ehLeitor ||
            estaNaListaDesejosProp !== undefined ||
            onAlternarDesejo
        ) {
            return;
        }

        let ativo = true;

        async function verificarDesejo() {
            try {
                const response = await listarDesejos();

                if (!ativo) return;

                setDesejoNaLista(
                    response.some(
                        desejo => desejo.edicao === edicao.id
                    )
                );
            } catch (error) {
                console.error(
                    "Erro ao verificar lista de desejos:",
                    error
                );
            }
        }

        verificarDesejo();

        return () => {
            ativo = false;
        };
    }, [
        edicao.id,
        ehLeitor,
        estaNaListaDesejosProp,
        onAlternarDesejo,
    ]);

    // ALTERNAR LIVRO NA LISTA DE DESEJOS
    async function alternarDesejo() {
        if (onAlternarDesejo) {
            onAlternarDesejo();
            return;
        }

        if (atualizandoDesejo) return;

        try {
            setAtualizandoDesejo(true);

            if (desejoAtivo) {
                await removerDesejo(edicao.id);
                setDesejoNaLista(false);
            } else {
                await adicionarDesejo({
                    edicao: edicao.id,
                });

                setDesejoNaLista(true);
            }
        } catch (error) {
            console.error(
                "Erro ao atualizar lista de desejos:",
                error
            );
        } finally {
            setAtualizandoDesejo(false);
        }
    }

    // CARREGAR RECOMENDAÇÕES
    useEffect(() => {
        if (recomendados !== undefined) {
            return;
        }

        let ativo = true;

        async function carregarRecomendacoes() {
            try {
                const dados = await buscarLivrosRecomendados([livro.id]);

                if (ativo) {
                    setRecomendacoesApi(dados);
                }
            } catch (error) {
                console.error(
                    "Erro ao carregar as recomendações:",
                    error
                );

                if (ativo) {
                    setRecomendacoesApi([]);
                }
            }
        }

        carregarRecomendacoes();

        return () => {
            ativo = false;
        };
    }, [livro.id, recomendados]);

    const recomendacoesExibidas = recomendados ?? recomendacoesApi;

    // CARREGAR ITENS DO CARRINHO
    useEffect(() => {
        let ativo = true;

        async function carregarCarrinho() {
            try {
                setCarregandoCarrinho(true);
                setErroCarrinho(false);

                const dados = await listarItensCarrinho();

                if (ativo) {
                    setItens(dados);
                }
            } catch (error) {
                console.error(
                    "Erro ao carregar o carrinho:",
                    error
                );

                if (ativo) {
                    setErroCarrinho(true);
                }
            } finally {
                if (ativo) {
                    setCarregandoCarrinho(false);
                }
            }
        }

        if (ehLeitor) {
            carregarCarrinho();
        } else if (perfil !== null) {
            setCarregandoCarrinho(false);
        }

        return () => {
            ativo = false;
        };
    }, [ehLeitor, perfil]);

    // VERIFICAR SE O LIVRO JÁ ESTÁ NO CARRINHO
    const itemNoCarrinho = itens.find(
        item => item.livroId === livro.id
    );

    const livroJaAdicionado = !!itemNoCarrinho;

    // VERIFICAR LIMITE DE LIVROS
    const limiteAtingido = itens.length >= 2;

    // VERIFICAR DISPONIBILIDADE DA EDIÇÃO
    const temDisponibilidade =
        edicao.exemplares_disponiveis > 0;

    // ADICIONAR OU REMOVER DO CARRINHO
    async function adicionarAoCarrinho() {
        if (
            atualizandoCarrinho ||
            carregandoCarrinho ||
            erroCarrinho
        ) {
            return;
        }

        setMensagem(null);
        setTipoMensagem(null);

        if (itemNoCarrinho) {
            try {
                setAtualizandoCarrinho(true);

                await removerItemCarrinho(itemNoCarrinho.id);

                setItens(itensAtuais =>
                    itensAtuais.filter(
                        item => item.id !== itemNoCarrinho.id
                    )
                );

                setTipoMensagem("sucesso");
                setMensagem("Livro removido do carrinho.");
            } catch (error) {
                console.error(
                    "Erro ao remover livro do carrinho:",
                    error
                );

                setTipoMensagem("erro");
                setMensagem(
                    "Não foi possível remover o livro do carrinho."
                );
            } finally {
                setAtualizandoCarrinho(false);
            }

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

        try {
            setAtualizandoCarrinho(true);

            const novoItem = await adicionarItemCarrinho(edicao.id);

            setItens(itensAtuais => [
                ...itensAtuais,
                novoItem,
            ]);

            setTipoMensagem("sucesso");
            setMensagem("Livro adicionado ao carrinho.");
        } catch (error) {
            console.error(
                "Erro ao adicionar livro ao carrinho:",
                error
            );

            setTipoMensagem("erro");
            setMensagem(
                "Não foi possível adicionar o livro ao carrinho."
            );
        } finally {
            setAtualizandoCarrinho(false);
        }
    }


    function useIsMd() {
        const [isMd, setIsMd] = useState(window.innerWidth >= 768);

        useEffect(() => {
            function verificarTela() {
                setIsMd(window.innerWidth >= 768);
            }

            window.addEventListener("resize", verificarTela);

            return () => {
                window.removeEventListener("resize", verificarTela);
            };
        }, []);

        return isMd;
    }

    const isMd = useIsMd();

    return (
        <>
            <div className="
                flex flex-col
                lg:flex-row lg:gap-8
                w-full min-w-0
            ">
                {/* CAPA */}
                <div className="
                    w-full sm:w-100
                    lg:w-80 lg:shrink-0
                    overflow-hidden rounded-xl
                    border border-gray-stroke
                    bg-light-gray
                    dark:border-surface-mid
                    dark:bg-surface-mid
                    h-fit
                ">
                    {!imageError && edicao.capa ? (
                        <img
                            src={edicao.capa}
                            onError={() => setImageError(true)}
                            alt={`Capa de ${livro.titulo}`}
                            className="
                                block w-full
                                aspect-2/3
                                object-cover h-full
                            "
                        />
                    ) : (
                        <div className="
                            relative flex w-full
                            aspect-2/3 max-h-125
                            items-center justify-center
                            rounded-xl border border-black
                            text-text-muted
                            dark:border-white
                            dark:text-text-light
                        ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="50"
                                fill="currentColor"
                                className="
                                    bi bi-book
                                    text-black dark:text-white
                                    sm:size-20
                                "
                                viewBox="0 0 16 16"
                            >
                                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                            </svg>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-3 w-full min-w-0 flex-1">
                    {/* TÍTULO E LISTA DE DESEJOS */}
                    <div className="
                        flex items-start
                        justify-between gap-5 md:justify-start
                    ">
                        <div className="min-w-0 w-fit">
                            <h1 className="
                                text-xl font-bold
                                font-space-grotesk
                                text-book-title
                                dark:text-text-light md:text-5xl
                            ">
                                {livro.titulo}
                            </h1>

                            <p className="
                                text-sm font-ubuntu
                                text-text-muted
                                dark:text-text-light md:text-3xl
                            ">
                                {livro.autor}
                            </p>
                        </div>

                        {/* LISTA DE DESEJOS */}
                        {ehLeitor && (
                            <button
                                type="button"
                                onClick={alternarDesejo}
                                disabled={atualizandoDesejo}
                                aria-label={
                                    desejoAtivo
                                        ? "Remover da lista de desejos"
                                        : "Adicionar à lista de desejos"
                                }
                                aria-pressed={desejoAtivo}
                                className="
                                    shrink-0
                                    text-primary
                                    transition-transform
                                    hover:scale-110
                                    disabled:cursor-default
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="40"
                                    height="40"
                                    fill={desejoAtivo ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="md:size-15"
                                >
                                    <path d="M6 3.75h12a1 1 0 0 1 1 1v16l-7-4-7 4v-16a1 1 0 0 1 1-1Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {/* AVALIAÇÃO MÉDIA */}
                    <div className="">
                        <AvaliacaoMedia
                            media={livro.media_avaliacoes}
                            quantidade={livro.quantidade_avaliacoes}
                        />
                    </div>


                    {/* DESCRIÇÃO */}
                    <DescricaoLivro
                        descricao={livro.descricao}
                    />

                    {/* ADICIONAR AO CARRINHO */}
                    <button
                        type="button"
                        onClick={adicionarAoCarrinho}
                        disabled={
                            carregandoCarrinho ||
                            atualizandoCarrinho ||
                            erroCarrinho ||
                            (!livroJaAdicionado && (!temDisponibilidade || limiteAtingido))
                        }
                        className="
                            w-full rounded-xl
                            bg-primary
                            px-5 py-3
                            font-semibold
                            text-light-blue-logo
                            transition-opacity
                            hover:opacity-90
                            disabled:cursor-not-allowed
                            disabled:opacity-50 md:w-fit md:px-20 md:text-2xl
                        "
                    >
                        {carregandoCarrinho
                            ? "CARREGANDO CARRINHO..."
                            : atualizandoCarrinho
                                ? "ATUALIZANDO..."
                                : erroCarrinho
                                    ? "ERRO AO CARREGAR CARRINHO"
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

                    {/* AVALIAR OU EDITAR AVALIAÇÃO */}
                    {ehLeitor &&
                        !carregandoPermissaoAvaliacao &&
                        permissaoAvaliacao?.pode_avaliar && (
                            <button
                                type="button"
                                onClick={() => setModalAvaliacaoAberto(true)}
                                className="
                                    mt-3 w-full rounded-xl
                                    border border-primary
                                    px-4 py-2
                                    font-semibold text-primary
                                    transition-colors
                                    hover:bg-primary hover:text-white md:w-fit md:px-20 md:text-2xl
                                "
                            >
                                {permissaoAvaliacao.ja_avaliou
                                    ? "EDITAR AVALIAÇÃO"
                                    : "AVALIAR LIVRO"
                                }
                            </button>
                        )
                    }

                    {isMd && (
                        <div className="mt-auto">
                            {/* RECOMENDAÇÕES */}
                            <LivrosRecomendados
                                livros={recomendacoesExibidas}
                                onAbrirLivro={onAbrirLivroRecomendado}
                            />
                        </div>
                    )}
                </div>
            </div>

            {!isMd && (
                <>
                    {/* RECOMENDAÇÕES */}
                    <LivrosRecomendados
                        livros={recomendacoesExibidas}
                        onAbrirLivro={onAbrirLivroRecomendado}
                    />
                </>
            )}

            {/* MODAL DE AVALIAÇÃO */}
            {modalAvaliacaoAberto && permissaoAvaliacao && (
                <AvaliacaoModal
                    livroId={livro.id}
                    titulo={livro.titulo}
                    capa={edicao.capa}
                    notaInicial={permissaoAvaliacao.nota_atual}
                    jaAvaliou={permissaoAvaliacao.ja_avaliou}
                    onFechar={() => setModalAvaliacaoAberto(false)}
                    onAvaliacaoEnviada={async () => {
                        await atualizarPermissaoAvaliacao();
                        await onAvaliacaoAtualizada?.();
                    }}
                />
            )}
        </>
    );
}
