
import { useEffect, useState } from "react";

import type { LivroPayload, CDDResponse } from "@/src/types/livro";
import type { EdicaoPayload } from "@/src/types/edicao";

import {
    cadastrarLivro,
    cadastrarEdicao,
    listarCDDs,
} from "@/src/services/livrosService";

import { criarExemplaresLote } from "@/src/services/exemplaresService";

export interface LivroForm {
    titulo: string;
    subtitulo: string;
    autor: string;
    descricao: string;
    generos: string;
    ano_original: string;
    cdd: number | "";
}

export interface EdicaoForm {
    ano_publicacao: string;
    editora: string;
    numero_paginas: string;
    edicao: string;
    isbn: string;
    capa: File | null;
    quantidade_exemplares: string;
}

const livroInicial: LivroForm = {
    titulo: "",
    subtitulo: "",
    autor: "",
    descricao: "",
    generos: "",
    ano_original: "",
    cdd: "",
};

const edicaoInicial: EdicaoForm = {
    ano_publicacao: "",
    editora: "",
    numero_paginas: "",
    edicao: "",
    isbn: "",
    capa: null,
    quantidade_exemplares: "1",
};

export default function useCadastrarLivro() {
    const [livro, setLivro] = useState<LivroForm>(livroInicial);
    const [edicoes, setEdicoes] = useState<EdicaoForm[]>([
        { ...edicaoInicial },
    ]);

    const [cdds, setCdds] = useState<CDDResponse[]>([]);
    const [carregandoCDDs, setCarregandoCDDs] = useState(true);
    const [carregando, setCarregando] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    // Carregar CDDs
    useEffect(() => {
        async function carregarCDDs() {
            try {
                const dados = await listarCDDs();
                setCdds(dados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os CDDs."
                );
            } finally {
                setCarregandoCDDs(false);
            }
        }

        void carregarCDDs();
    }, []);

    // Atualizar dados do livro
    function atualizarLivro<K extends keyof LivroForm>(
        campo: K,
        valor: LivroForm[K]
    ) {
        setLivro((anterior) => ({
            ...anterior,
            [campo]: valor,
        }));
    }

    // Atualizar uma edição
    function atualizarEdicao<K extends keyof EdicaoForm>(
        indice: number,
        campo: K,
        valor: EdicaoForm[K]
    ) {
        setEdicoes((anteriores) =>
            anteriores.map((edicao, i) =>
                i === indice
                    ? { ...edicao, [campo]: valor }
                    : edicao
            )
        );
    }

    // Adicionar edição
    function adicionarEdicao() {
        setEdicoes((anteriores) => [
            ...anteriores,
            { ...edicaoInicial },
        ]);
    }

    // Remover edição
    function removerEdicao(indice: number) {
        setEdicoes((anteriores) =>
            anteriores.filter((_, i) => i !== indice)
        );
    }

    // Validar formulário
    function validarFormulario(): string | null {
        if (
            !livro.titulo.trim() ||
            !livro.autor.trim() ||
            !livro.ano_original.trim()
        ) {
            return "Preencha o título, autor e ano original do livro.";
        }

        if (edicoes.length === 0) {
            return "Adicione pelo menos uma edição.";
        }

        for (let i = 0; i < edicoes.length; i++) {
            const edicao = edicoes[i];

            if (
                !edicao.ano_publicacao ||
                !edicao.editora.trim() ||
                !edicao.numero_paginas ||
                !edicao.edicao.trim() ||
                !edicao.quantidade_exemplares
            ) {
                return `Preencha os campos obrigatórios da edição ${i + 1}.`;
            }

            const ano = Number(edicao.ano_publicacao);
            const paginas = Number(edicao.numero_paginas);
            const quantidade = Number(edicao.quantidade_exemplares);

            if (!Number.isInteger(ano) || ano < 1000 || ano > 9999) {
                return `Ano de publicação inválido na edição ${i + 1}.`;
            }

            if (!Number.isInteger(paginas) || paginas <= 0) {
                return `Número de páginas inválido na edição ${i + 1}.`;
            }

            if (
                !Number.isInteger(quantidade) ||
                quantidade < 1 ||
                quantidade > 100
            ) {
                return `A quantidade de exemplares da edição ${i + 1} deve estar entre 1 e 100.`;
            }
        }

        return null;
    }

    // Cadastrar livro, edições e exemplares
    async function cadastrar() {
        setErro("");
        setSucesso("");

        const mensagemValidacao = validarFormulario();

        if (mensagemValidacao) {
            setErro(mensagemValidacao);
            return;
        }

        setCarregando(true);

        try {
            const livroPayload: LivroPayload = {
                titulo: livro.titulo.trim(),
                subtitulo: livro.subtitulo.trim(),
                autor: livro.autor.trim(),
                descricao: livro.descricao.trim(),
                generos: livro.generos.trim(),
                ano_original: livro.ano_original.trim(),
                cdd: livro.cdd === "" ? null : livro.cdd,
            };

            // Cadastrar livro
            const livroCriado = await cadastrarLivro(livroPayload);

            // Cadastrar edições e exemplares
            for (const edicao of edicoes) {
                const edicaoPayload: EdicaoPayload = {
                    livro: livroCriado.id,
                    ano_publicacao: Number(edicao.ano_publicacao),
                    editora: edicao.editora.trim(),
                    numero_paginas: Number(edicao.numero_paginas),
                    edicao: edicao.edicao.trim(),
                    isbn: edicao.isbn.trim() || null,
                    capa: edicao.capa,
                };

                const edicaoCriada = await cadastrarEdicao(edicaoPayload);

                await criarExemplaresLote(edicaoCriada.id, {
                    quantidade: Number(edicao.quantidade_exemplares),
                });
            }

            setSucesso("Livro, edições e exemplares cadastrados com sucesso.");

            setLivro({ ...livroInicial });
            setEdicoes([{ ...edicaoInicial }]);

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível concluir o cadastro."
            );
        } finally {
            setCarregando(false);
        }
    }

    return {
        livro,
        edicoes,
        cdds,

        carregandoCDDs,
        carregando,
        erro,
        sucesso,

        setErro,
        setSucesso,

        atualizarLivro,
        atualizarEdicao,
        adicionarEdicao,
        removerEdicao,
        cadastrar,
    };
}
