
import { useCallback, useEffect, useState } from "react";

import type { LivroResponse, LivroPayload } from "@/src/types/livro";
import type { EdicaoResponse, EdicaoPayload } from "@/src/types/edicao";
import type { ExemplarResponse } from "@/src/types/exemplar";

import {
    listarExemplaresBibliotecario,
    baixarExemplar,
    criarExemplaresLote,
} from "@/src/services/exemplaresService";

import TabelaExemplaresEdicao from "./TabelaExemplaresEdicao";

interface DetalhesLivroProps {
    livro: LivroResponse;
    edicoes: EdicaoResponse[];
    onFechar: () => void;

    onSalvarLivro: (
        id: number,
        dados: Partial<LivroPayload>
    ) => Promise<boolean>;

    onSalvarEdicao: (
        id: number,
        dados: Partial<EdicaoPayload>
    ) => Promise<boolean>;

    onCriarEdicao: (
        dados: EdicaoPayload
    ) => Promise<boolean>;

    onAtualizarDados: () => Promise<void>;

    salvando: boolean;
}

export default function DetalhesLivro({
    livro,
    edicoes,
    onFechar,
    onSalvarLivro,
    onSalvarEdicao,
    onCriarEdicao,
    onAtualizarDados,
    salvando,
}: DetalhesLivroProps) {
    const [editandoLivro, setEditandoLivro] = useState(false);
    const [edicaoEmEdicao, setEdicaoEmEdicao] = useState<number | null>(null);

    const [exemplares, setExemplares] = useState<ExemplarResponse[]>([]);
    const [carregandoExemplares, setCarregandoExemplares] = useState(false);
    const [salvandoBaixa, setSalvandoBaixa] = useState(false);
    const [erroExemplares, setErroExemplares] = useState<string | null>(null);

    // Cadastro de edição
    const [criandoEdicao, setCriandoEdicao] = useState(false);
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    const [anoNovaEdicao, setAnoNovaEdicao] = useState("");
    const [editoraNovaEdicao, setEditoraNovaEdicao] = useState("");
    const [paginasNovaEdicao, setPaginasNovaEdicao] = useState("");
    const [numeroNovaEdicao, setNumeroNovaEdicao] = useState("");
    const [isbnNovaEdicao, setIsbnNovaEdicao] = useState("");
    const [capaNovaEdicao, setCapaNovaEdicao] = useState<File | null>(null);

    const [erroCadastro, setErroCadastro] = useState<string | null>(null);
    const [sucessoCadastro, setSucessoCadastro] = useState<string | null>(null);

    // Dados do livro
    const [titulo, setTitulo] = useState(livro.titulo);
    const [subtitulo, setSubtitulo] = useState(livro.subtitulo);
    const [autor, setAutor] = useState(livro.autor);
    const [descricao, setDescricao] = useState(livro.descricao ?? "");
    const [generos, setGeneros] = useState(livro.generos);
    const [anoOriginal, setAnoOriginal] = useState(livro.ano_original);
    const [cdd, setCdd] = useState(
        livro.cdd === null ? "" : String(livro.cdd)
    );

    // Atualiza os dados do formulário quando o livro selecionado muda.
    useEffect(() => {
        setTitulo(livro.titulo);
        setSubtitulo(livro.subtitulo);
        setAutor(livro.autor);
        setDescricao(livro.descricao ?? "");
        setGeneros(livro.generos);
        setAnoOriginal(livro.ano_original);
        setCdd(livro.cdd === null ? "" : String(livro.cdd));

        setEditandoLivro(false);
        setEdicaoEmEdicao(null);
        setCriandoEdicao(false);
    }, [livro]);

    // Carrega os exemplares cadastrados para o bibliotecário.
    const carregarExemplares = useCallback(async () => {
        try {
            setCarregandoExemplares(true);
            setErroExemplares(null);

            const dados = await listarExemplaresBibliotecario("todos");

            setExemplares(dados);
        } catch (error) {
            setErroExemplares(
                error instanceof Error
                    ? error.message
                    : "Não foi possível carregar os exemplares."
            );
        } finally {
            setCarregandoExemplares(false);
        }
    }, []);

    useEffect(() => {
        carregarExemplares();
    }, [carregarExemplares, livro.id]);

    // Realiza a baixa patrimonial de um exemplar.
    async function realizarBaixa(id: number, motivo: string) {
        try {
            setSalvandoBaixa(true);
            setErroExemplares(null);

            await baixarExemplar(id, {
                motivo_baixa: motivo,
            });

            await carregarExemplares();
            await onAtualizarDados();

            return true;
        } catch (error) {
            setErroExemplares(
                error instanceof Error
                    ? error.message
                    : "Não foi possível realizar a baixa patrimonial."
            );

            return false;
        } finally {
            setSalvandoBaixa(false);
        }
    }

    // Salva as alterações do livro.
    async function salvarLivro(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const sucesso = await onSalvarLivro(livro.id, {
            titulo,
            subtitulo,
            autor,
            descricao,
            generos,
            ano_original: anoOriginal,
            cdd: cdd === "" ? null : Number(cdd),
        });

        if (sucesso) {
            setEditandoLivro(false);
        }
    }

    // Cadastra uma nova edição para o livro selecionado.
    async function cadastrarNovaEdicao(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        try {
            setSalvandoEdicao(true);
            setErroCadastro(null);
            setSucessoCadastro(null);

            const dados: EdicaoPayload = {
                livro: livro.id,
                ano_publicacao: Number(anoNovaEdicao),
                editora: editoraNovaEdicao.trim(),
                numero_paginas: Number(paginasNovaEdicao),
                edicao: numeroNovaEdicao.trim(),
                isbn: isbnNovaEdicao.trim() || null,
                ...(capaNovaEdicao ? { capa: capaNovaEdicao } : {}),
            };

            const sucesso = await onCriarEdicao(dados);

            if (sucesso) {
                setSucessoCadastro("Edição cadastrada com sucesso.");

                setAnoNovaEdicao("");
                setEditoraNovaEdicao("");
                setPaginasNovaEdicao("");
                setNumeroNovaEdicao("");
                setIsbnNovaEdicao("");
                setCapaNovaEdicao(null);

                setCriandoEdicao(false);
            }
        } catch (error) {
            setErroCadastro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível cadastrar a edição."
            );
        } finally {
            setSalvandoEdicao(false);
        }
    }

    // Cadastra exemplares em lote para uma edição.
    async function adicionarExemplares(
        edicaoId: number,
        quantidade: number
    ): Promise<boolean> {
        try {
            setErroExemplares(null);

            await criarExemplaresLote(edicaoId, {
                quantidade,
            });

            await carregarExemplares();
            await onAtualizarDados();

            return true;
        } catch (error) {
            setErroExemplares(
                error instanceof Error
                    ? error.message
                    : "Não foi possível adicionar os exemplares."
            );

            return false;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
            <section className="my-8 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">

                {/* Cabeçalho */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Detalhes do livro
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Livro #{livro.id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onFechar}
                        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Fechar
                    </button>
                </div>

                {/* Informações do livro */}
                <div className="mb-8 rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Informações do livro
                        </h3>

                        {!editandoLivro && (
                            <button
                                type="button"
                                onClick={() => setEditandoLivro(true)}
                                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Editar livro
                            </button>
                        )}
                    </div>

                    {editandoLivro ? (
                        <form onSubmit={salvarLivro} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                    Título
                                </label>

                                <input
                                    required
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                    Subtítulo
                                </label>

                                <input
                                    value={subtitulo}
                                    onChange={(e) => setSubtitulo(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                    Autor
                                </label>

                                <input
                                    required
                                    value={autor}
                                    onChange={(e) => setAutor(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                    Descrição
                                </label>

                                <textarea
                                    rows={3}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                    Gêneros
                                </label>

                                <input
                                    value={generos}
                                    onChange={(e) => setGeneros(e.target.value)}
                                    placeholder="Romance, Drama"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                        Ano original
                                    </label>

                                    <input
                                        required
                                        value={anoOriginal}
                                        onChange={(e) => setAnoOriginal(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                        ID do CDD
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={cdd}
                                        onChange={(e) => setCdd(e.target.value)}
                                        placeholder="Deixe vazio para remover"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={salvando}
                                    onClick={() => setEditandoLivro(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {salvando ? "Salvando..." : "Salvar alterações"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Informacao label="Título" valor={livro.titulo} />
                            <Informacao label="Subtítulo" valor={livro.subtitulo} />
                            <Informacao label="Autor" valor={livro.autor} />
                            <Informacao label="Ano original" valor={livro.ano_original} />
                            <Informacao label="Gêneros" valor={livro.generos} />

                            <Informacao
                                label="CDD"
                                valor={livro.cdd === null ? "Não informado" : String(livro.cdd)}
                            />

                            <div className="sm:col-span-2">
                                <Informacao
                                    label="Descrição"
                                    valor={livro.descricao || "Sem descrição"}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Edições */}
                <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Edições ({edicoes.length})
                        </h3>

                        <button
                            type="button"
                            onClick={() => {
                                setCriandoEdicao((atual) => !atual);
                                setErroCadastro(null);
                                setSucessoCadastro(null);
                            }}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            {criandoEdicao ? "Cancelar" : "+ Adicionar edição"}
                        </button>
                    </div>

                    {erroCadastro && (
                        <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                            {erroCadastro}
                        </p>
                    )}

                    {sucessoCadastro && (
                        <p className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
                            {sucessoCadastro}
                        </p>
                    )}

                    {erroExemplares && (
                        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                            {erroExemplares}
                        </p>
                    )}

                    {/* Formulário de nova edição */}
                    {criandoEdicao && (
                        <form
                            onSubmit={cadastrarNovaEdicao}
                            className="mb-5 space-y-4 rounded-xl border border-blue-200 p-5 dark:border-blue-900"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                Nova edição de {livro.titulo}
                            </h4>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Campo
                                    label="Ano de publicação"
                                    type="number"
                                    value={anoNovaEdicao}
                                    onChange={setAnoNovaEdicao}
                                    required
                                />

                                <Campo
                                    label="Editora"
                                    value={editoraNovaEdicao}
                                    onChange={setEditoraNovaEdicao}
                                    required
                                />

                                <Campo
                                    label="Número de páginas"
                                    type="number"
                                    value={paginasNovaEdicao}
                                    onChange={setPaginasNovaEdicao}
                                    required
                                />

                                <Campo
                                    label="Número da edição"
                                    value={numeroNovaEdicao}
                                    onChange={setNumeroNovaEdicao}
                                    required
                                />

                                <Campo
                                    label="ISBN"
                                    value={isbnNovaEdicao}
                                    onChange={setIsbnNovaEdicao}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                                    Capa
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setCapaNovaEdicao(
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                    className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 dark:text-gray-300 dark:file:bg-gray-700"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={salvandoEdicao || salvando}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {salvandoEdicao
                                        ? "Cadastrando..."
                                        : "Cadastrar edição"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Lista de edições */}
                    {edicoes.length === 0 ? (
                        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            Este livro ainda não possui edições cadastradas.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {edicoes.map((edicao) => (
                                <CardEdicaoGestao
                                    key={edicao.id}
                                    edicao={edicao}
                                    editando={edicaoEmEdicao === edicao.id}
                                    salvando={salvando}
                                    exemplares={exemplares.filter(
                                        (exemplar) => exemplar.edicao === edicao.id
                                    )}
                                    carregandoExemplares={carregandoExemplares}
                                    salvandoBaixa={salvandoBaixa}
                                    onBaixar={realizarBaixa}
                                    onCriarExemplares={adicionarExemplares}
                                    onEditar={() => setEdicaoEmEdicao(edicao.id)}
                                    onCancelar={() => setEdicaoEmEdicao(null)}
                                    onSalvar={async (dados) => {
                                        const sucesso = await onSalvarEdicao(
                                            edicao.id,
                                            dados
                                        );

                                        if (sucesso) {
                                            setEdicaoEmEdicao(null);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function Informacao({
    label,
    valor,
}: {
    label: string;
    valor: string;
}) {
    return (
        <div>
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                {label}
            </p>

            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {valor || "Não informado"}
            </p>
        </div>
    );
}

interface CardEdicaoGestaoProps {
    edicao: EdicaoResponse;
    editando: boolean;
    salvando: boolean;

    onEditar: () => void;
    onCancelar: () => void;
    onSalvar: (dados: Partial<EdicaoPayload>) => Promise<void>;

    exemplares: ExemplarResponse[];
    carregandoExemplares: boolean;
    salvandoBaixa: boolean;

    onBaixar: (id: number, motivo: string) => Promise<boolean>;

    onCriarExemplares: (
        edicaoId: number,
        quantidade: number
    ) => Promise<boolean>;
}

function CardEdicaoGestao({
    edicao,
    editando,
    salvando,
    onEditar,
    onCancelar,
    onSalvar,
    exemplares,
    carregandoExemplares,
    salvandoBaixa,
    onBaixar,
    onCriarExemplares,
}: CardEdicaoGestaoProps) {
    const [anoPublicacao, setAnoPublicacao] = useState(
        String(edicao.ano_publicacao)
    );

    const [editora, setEditora] = useState(edicao.editora);
    const [numeroPaginas, setNumeroPaginas] = useState(
        String(edicao.numero_paginas)
    );

    const [numeroEdicao, setNumeroEdicao] = useState(edicao.edicao);
    const [isbn, setIsbn] = useState(edicao.isbn ?? "");
    const [capa, setCapa] = useState<File | null>(null);

    // Cadastro de exemplares
    const [quantidadeExemplares, setQuantidadeExemplares] = useState("1");
    const [salvandoExemplares, setSalvandoExemplares] = useState(false);
    const [erroCadastroExemplares, setErroCadastroExemplares] =
        useState<string | null>(null);

    useEffect(() => {
        setAnoPublicacao(String(edicao.ano_publicacao));
        setEditora(edicao.editora);
        setNumeroPaginas(String(edicao.numero_paginas));
        setNumeroEdicao(edicao.edicao);
        setIsbn(edicao.isbn ?? "");
        setCapa(null);
    }, [edicao]);

    async function salvar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await onSalvar({
            ano_publicacao: Number(anoPublicacao),
            editora,
            numero_paginas: Number(numeroPaginas),
            edicao: numeroEdicao,
            isbn: isbn.trim() || null,
            ...(capa ? { capa } : {}),
        });
    }

    // Adiciona exemplares à edição.
    async function adicionarExemplares(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const quantidade = Number(quantidadeExemplares);

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            setErroCadastroExemplares(
                "Informe uma quantidade inteira maior que zero."
            );
            return;
        }

        try {
            setSalvandoExemplares(true);
            setErroCadastroExemplares(null);

            const sucesso = await onCriarExemplares(
                edicao.id,
                quantidade
            );

            if (sucesso) {
                setQuantidadeExemplares("1");
            } else {
                setErroCadastroExemplares(
                    "Não foi possível adicionar os exemplares."
                );
            }
        } finally {
            setSalvandoExemplares(false);
        }
    }

    return (
        <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {edicao.edicao} — {edicao.editora}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Edição #{edicao.id}
                    </p>
                </div>

                {!editando && (
                    <button
                        type="button"
                        onClick={onEditar}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Editar
                    </button>
                )}
            </div>

            {editando ? (
                <form onSubmit={salvar} className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Campo
                            label="Ano de publicação"
                            type="number"
                            value={anoPublicacao}
                            onChange={setAnoPublicacao}
                            required
                        />

                        <Campo
                            label="Editora"
                            value={editora}
                            onChange={setEditora}
                            required
                        />

                        <Campo
                            label="Número de páginas"
                            type="number"
                            value={numeroPaginas}
                            onChange={setNumeroPaginas}
                            required
                        />

                        <Campo
                            label="Número da edição"
                            value={numeroEdicao}
                            onChange={setNumeroEdicao}
                            required
                        />

                        <Campo
                            label="ISBN"
                            value={isbn}
                            onChange={setIsbn}
                        />
                    </div>

                    {edicao.capa && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Esta edição já possui uma capa. Selecione outra imagem para substituí-la.
                        </p>
                    )}

                    <div>
                        <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                            Nova capa
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setCapa(e.target.files?.[0] ?? null)
                            }
                            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 dark:text-gray-300 dark:file:bg-gray-700"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            disabled={salvando}
                            onClick={onCancelar}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {salvando ? "Salvando..." : "Salvar edição"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <Informacao
                        label="Ano de publicação"
                        valor={String(edicao.ano_publicacao)}
                    />

                    <Informacao
                        label="Páginas"
                        valor={String(edicao.numero_paginas)}
                    />

                    <Informacao
                        label="ISBN"
                        valor={edicao.isbn ?? "Não informado"}
                    />

                    <Informacao
                        label="Exemplares"
                        valor={`${edicao.exemplares_disponiveis} disponíveis de ${edicao.total_exemplares}`}
                    />
                </div>
            )}

            {/* Gestão de exemplares */}
            <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
                <h5 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Gestão de exemplares ({exemplares.length})
                </h5>

                {/* Formulário para adicionar exemplares */}
                <form
                    onSubmit={adicionarExemplares}
                    className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                >
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quantidade de novos exemplares
                    </label>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={quantidadeExemplares}
                            onChange={(e) =>
                                setQuantidadeExemplares(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:max-w-32"
                        />

                        <button
                            type="submit"
                            disabled={salvandoExemplares}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {salvandoExemplares
                                ? "Adicionando..."
                                : "Adicionar exemplares"}
                        </button>
                    </div>

                    {erroCadastroExemplares && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {erroCadastroExemplares}
                        </p>
                    )}
                </form>

                <TabelaExemplaresEdicao
                    exemplares={exemplares}
                    carregando={carregandoExemplares}
                    salvando={salvandoBaixa}
                    onBaixar={onBaixar}
                />
            </div>
        </article>
    );
}

function Campo({
    label,
    value,
    onChange,
    type = "text",
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <input
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
        </div>
    );
}
