
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Loader from "@/components/app/loader_animation/loader";

import LivroDetalhes from "@/components/livros/LivroDetalhes";

import type { LivroResponse } from "@/src/types/livro";
import type { EdicaoResponse } from "@/src/types/edicao";

import { buscarEdicao } from "@/src/services/edicoesService";
import { buscarLivro } from "@/src/services/livrosService";

export default function TesteLivroDetalhes() {

    const { edicaoId } = useParams();

    const [livro, setLivro] = useState<LivroResponse | null>(null);
    const [edicao, setEdicao] = useState<EdicaoResponse | null>(null);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // BUSCAR DADOS DO LIVRO E DA EDIÇÃO
    useEffect(() => {

        let ativo = true;

        async function carregarDetalhes() {

            try {

                setCarregando(true);
                setErro(null);

                // Validar ID recebido pela URL
                const id = Number(edicaoId);

                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("ID de edição inválido.");
                }

                // Buscar edição
                const edicaoEncontrada = await buscarEdicao(id);

                // Buscar livro relacionado à edição
                const livroEncontrado = await buscarLivro(
                    edicaoEncontrada.livro
                );


                console.log("Edição encontrada:", edicaoEncontrada);
                console.log("Livro encontrado:", livroEncontrado);

                console.log("ID do livro na edição:", edicaoEncontrada.livro);
                console.log("ID do livro retornado:", livroEncontrado.id);

                console.log("Tipos:", {
                    livroNaEdicao: typeof edicaoEncontrada.livro,
                    idDoLivro: typeof livroEncontrado.id
                });


                // Verificar relacionamento
                if (edicaoEncontrada.livro !== livroEncontrado.id) {
                    throw new Error(
                        "A edição não pertence ao livro encontrado."
                    );
                }

                if (!ativo) return;

                setEdicao(edicaoEncontrada);
                setLivro(livroEncontrado);

            } catch (error) {

                if (!ativo) return;

                setErro(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os detalhes."
                );

            } finally {

                if (ativo) {
                    setCarregando(false);
                }

            }
        }

        carregarDetalhes();

        return () => {
            ativo = false;
        };

    }, [edicaoId]);

    // CARREGANDO
    if (carregando) {
        return (
            <div className="absolute inset-0 flex items-center justify-center scale-150">
                <Loader />
            </div>
        );
    }

    // ERRO
    if (erro) {
        return (
            <div className="
                flex min-h-96 flex-col
                items-center justify-center
                gap-4 px-5
            ">

                <p className="text-center text-warning">
                    {erro}
                </p>

                <Link
                    to="/home"
                    className="
                        rounded-xl
                        bg-primary
                        px-5 py-3
                        font-semibold
                        text-light-blue-logo
                        hover:opacity-90
                    "
                >
                    VOLTAR PARA HOME
                </Link>

            </div>
        );
    }

    // DADOS NÃO ENCONTRADOS
    if (!livro || !edicao) {
        return null;
    }

    // EXIBIR DETALHES
    return (
        <LivroDetalhes
            livro={livro}
            edicao={edicao}
        />
    );
}
