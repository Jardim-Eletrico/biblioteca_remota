
import { useCallback, useEffect, useMemo, useState } from "react";

import type { LivroResponse } from "@/src/types/livro";
import type { EdicaoResponse, EdicaoPayload } from "@/src/types/edicao";

import { listarLivros, atualizarLivroParcial } from "@/src/services/livrosService";

import {
    listarEdicoes,
    atualizarEdicaoParcial,
} from "@/src/services/edicoesService";

export default function useGestaoLivros() {
    // Dados
    const [livros, setLivros] = useState<LivroResponse[]>([]);
    const [edicoes, setEdicoes] = useState<EdicaoResponse[]>([]);

    // Pesquisa e filtros
    const [pesquisa, setPesquisa] = useState("");
    const [filtroCDD, setFiltroCDD] = useState("todos");
    const [filtroGenero, setFiltroGenero] = useState("todos");

    // Livro selecionado
    const [livroSelecionado, setLivroSelecionado] =
        useState<LivroResponse | null>(null);

    // Controle da interface
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    // Carregar livros e edições
    const carregarDados = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);

            const [livrosResponse, edicoesResponse] = await Promise.all([
                listarLivros(),
                listarEdicoes(),
            ]);

            setLivros(livrosResponse);
            setEdicoes(edicoesResponse);
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar o acervo."
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    // Relacionar cada livro às suas edições
    const livrosComEdicoes = useMemo(() => {
        return livros.map((livro) => ({
            livro,
            edicoes: edicoes.filter(
                (edicao) => edicao.livro === livro.id
            ),
        }));
    }, [livros, edicoes]);

    // Obter gêneros disponíveis
    const generosDisponiveis = useMemo(() => {
        return Array.from(
            new Set(
                livros.flatMap((livro) =>
                    livro.generos
                        .split(",")
                        .map((genero) => genero.trim())
                        .filter(Boolean)
                )
            )
        ).sort();
    }, [livros]);

    // Obter CDDs disponíveis
    const cddsDisponiveis = useMemo(() => {
        return Array.from(
            new Set(
                livros
                    .map((livro) => livro.cdd)
                    .filter((cdd): cdd is number => cdd !== null)
            )
        ).sort((a, b) => a - b);
    }, [livros]);

    // Filtrar livros
    const livrosFiltrados = useMemo(() => {
        const termo = pesquisa.toLowerCase().trim();

        return livrosComEdicoes.filter(({ livro }) => {
            const correspondePesquisa =
                !termo ||
                livro.titulo.toLowerCase().includes(termo) ||
                livro.autor.toLowerCase().includes(termo);

            const correspondeCDD =
                filtroCDD === "todos" ||
                String(livro.cdd) === filtroCDD;

            const correspondeGenero =
                filtroGenero === "todos" ||
                livro.generos
                    .split(",")
                    .map((genero) => genero.trim())
                    .includes(filtroGenero);

            return (
                correspondePesquisa &&
                correspondeCDD &&
                correspondeGenero
            );
        });
    }, [livrosComEdicoes, pesquisa, filtroCDD, filtroGenero]);

    // Selecionar livro
    function selecionarLivro(livro: LivroResponse | null) {
        setLivroSelecionado(livro);
        setErro(null);
        setSucesso(null);
    }

    // Atualizar livro
    async function atualizarLivro(
        id: number,
        dados: Partial<LivroResponse>
    ) {
        try {
            setSalvando(true);
            setErro(null);
            setSucesso(null);

            const livroAtualizado = await atualizarLivroParcial(id, dados);

            setLivros((anteriores) =>
                anteriores.map((livro) =>
                    livro.id === id ? livroAtualizado : livro
                )
            );

            if (livroSelecionado?.id === id) {
                setLivroSelecionado(livroAtualizado);
            }

            setSucesso("Livro atualizado com sucesso.");

            return true;
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar livro."
            );

            return false;
        } finally {
            setSalvando(false);
        }
    }

    // Atualizar edição
    async function atualizarEdicao(
        id: number,
        dados: Partial<EdicaoPayload>
    ) {
        try {
            setSalvando(true);
            setErro(null);
            setSucesso(null);

            const edicaoAtualizada = await atualizarEdicaoParcial(
                id,
                dados
            );

            setEdicoes((anteriores) =>
                anteriores.map((edicao) =>
                    edicao.id === id ? edicaoAtualizada : edicao
                )
            );

            setSucesso("Edição atualizada com sucesso.");

            return true;
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar edição."
            );

            return false;
        } finally {
            setSalvando(false);
        }
    }

    return {
        livros,
        edicoes,
        livrosComEdicoes,
        livrosFiltrados,

        pesquisa,
        setPesquisa,

        filtroCDD,
        setFiltroCDD,

        filtroGenero,
        setFiltroGenero,

        generosDisponiveis,
        cddsDisponiveis,

        livroSelecionado,
        selecionarLivro,

        carregando,
        salvando,
        erro,
        sucesso,
        setErro,
        setSucesso,

        carregarDados,
        atualizarLivro,
        atualizarEdicao,
    };
}
