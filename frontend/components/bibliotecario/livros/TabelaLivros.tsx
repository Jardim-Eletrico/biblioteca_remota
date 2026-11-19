
import { useEffect, useState } from "react";

import type { LivroResponse } from "@/src/types/livro";
import type { EdicaoResponse } from "@/src/types/edicao";

interface LivroComEdicoes {
    livro: LivroResponse;
    edicoes: EdicaoResponse[];
}

interface TabelaLivrosProps {
    livros: LivroComEdicoes[];
    pesquisa: string;
    setPesquisa: (valor: string) => void;
    filtroCDD: string;
    setFiltroCDD: (valor: string) => void;
    filtroGenero: string;
    setFiltroGenero: (valor: string) => void;
    cddsDisponiveis: number[];
    generosDisponiveis: string[];
    onDetalhes: (livro: LivroResponse) => void;
}

const ITENS_POR_PAGINA = 10;

export default function TabelaLivros({
    livros,
    pesquisa,
    setPesquisa,
    filtroCDD,
    setFiltroCDD,
    filtroGenero,
    setFiltroGenero,
    cddsDisponiveis,
    generosDisponiveis,
    onDetalhes,
}: TabelaLivrosProps) {
    const [paginaAtual, setPaginaAtual] = useState(1);

    // Reinicia a paginação quando os filtros mudarem.
    useEffect(() => {
        setPaginaAtual(1);
    }, [pesquisa, filtroCDD, filtroGenero]);

    const totalPaginas = Math.ceil(livros.length / ITENS_POR_PAGINA);

    const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const indiceFinal = indiceInicial + ITENS_POR_PAGINA;

    const livrosDaPagina = livros.slice(indiceInicial, indiceFinal);

    // Evita permanecer em uma página inexistente após alterações nos dados.
    useEffect(() => {
        if (totalPaginas > 0 && paginaAtual > totalPaginas) {
            setPaginaAtual(totalPaginas);
        }
    }, [paginaAtual, totalPaginas]);

    const primeiroResultado = livros.length === 0 ? 0 : indiceInicial + 1;
    const ultimoResultado = Math.min(indiceFinal, livros.length);

    return (
        <section className="space-y-5">
            {/* Filtros */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                    type="search"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar por título ou autor..."
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <select
                    value={filtroCDD}
                    onChange={(e) => setFiltroCDD(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                    <option value="todos">Todos os CDDs</option>

                    {cddsDisponiveis.map((cdd) => (
                        <option key={cdd} value={String(cdd)}>
                            CDD {cdd}
                        </option>
                    ))}
                </select>

                <select
                    value={filtroGenero}
                    onChange={(e) => setFiltroGenero(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                    <option value="todos">Todos os gêneros</option>

                    {generosDisponiveis.map((genero) => (
                        <option key={genero} value={genero}>
                            {genero}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <table className="w-full min-w-[1000px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Livro
                            </th>
                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Autor
                            </th>
                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Gêneros
                            </th>
                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Ano original
                            </th>
                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                CDD
                            </th>
                            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Edições
                            </th>
                            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Exemplares
                            </th>
                            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {livrosDaPagina.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Nenhum livro encontrado.
                                </td>
                            </tr>
                        ) : (
                            livrosDaPagina.map(({ livro, edicoes }) => {
                                const totalExemplares = edicoes.reduce(
                                    (total, edicao) =>
                                        total + edicao.total_exemplares,
                                    0
                                );

                                const disponiveis = edicoes.reduce(
                                    (total, edicao) =>
                                        total + edicao.exemplares_disponiveis,
                                    0
                                );

                                return (
                                    <tr
                                        key={livro.id}
                                        className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="max-w-[240px]">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {livro.titulo}
                                                </p>

                                                {livro.subtitulo && (
                                                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                                        {livro.subtitulo}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {livro.autor}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="max-w-[180px] text-sm text-gray-700 dark:text-gray-300">
                                                {livro.generos || "—"}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {livro.ano_original}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {livro.cdd ?? "—"}
                                        </td>

                                        <td className="px-5 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
                                            {edicoes.length}
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {disponiveis}
                                            </span>

                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {" "}/ {totalExemplares}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => onDetalhes(livro)}
                                                className="whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-600 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                                            >
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Informações e navegação */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {livros.length === 0
                        ? "Nenhum livro para exibir."
                        : `Exibindo ${primeiroResultado}–${ultimoResultado} de ${livros.length} livros.`}
                </p>

                {totalPaginas > 1 && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                            disabled={paginaAtual === 1}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Anterior
                        </button>

                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Página {paginaAtual} de {totalPaginas}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                            disabled={paginaAtual === totalPaginas}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
