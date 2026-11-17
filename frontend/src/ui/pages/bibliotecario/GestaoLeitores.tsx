
import { useEffect, useMemo, useState } from "react";

import type { LeitorResponse } from "@/src/types/leitor";
import {
    listarLeitores,
    buscarLeitores,
} from "@/src/services/leitorService";

import LeitoresTabela from "@/components/bibliotecario/leitores/LeitoresTabela";
import FiltrosLeitores, {
    type FiltroLeitor,
} from "@/components/bibliotecario/leitores/FiltrosLeitores";

function formatarData(data: string): string {
    if (!data) return "Não informada";

    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

export default function GestaoLeitores() {
    const [leitores, setLeitores] = useState<LeitorResponse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [busca, setBusca] = useState("");
    const [buscaAplicada, setBuscaAplicada] = useState("");

    const [filtro, setFiltro] = useState<FiltroLeitor>("todos");
    const [leitorSelecionado, setLeitorSelecionado] =
        useState<LeitorResponse | null>(null);

    async function atualizarLeitores(nome?: string) {
        setCarregando(true);
        setErro("");

        try {
            const resultado = nome
                ? await buscarLeitores(nome)
                : await listarLeitores();

            setLeitores(resultado);
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível carregar os leitores."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        atualizarLeitores();
    }, []);

    function handleBuscar(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nome = busca.trim();
        setBuscaAplicada(nome);
        atualizarLeitores(nome || undefined);
    }

    function handleLimparBusca() {
        setBusca("");
        setBuscaAplicada("");
        atualizarLeitores();
    }

    const contagens = useMemo(() => {
        const atrasados = leitores.filter((leitor) =>
            leitor.emprestimos.some((emprestimo) => emprestimo.atrasado)
        ).length;

        return {
            todos: leitores.length,
            atrasados,
            emDia: leitores.length - atrasados,
        };
    }, [leitores]);

    const leitoresFiltrados = useMemo(() => {
        switch (filtro) {
            case "atrasados":
                return leitores.filter((leitor) =>
                    leitor.emprestimos.some(
                        (emprestimo) => emprestimo.atrasado
                    )
                );

            case "emDia":
                return leitores.filter(
                    (leitor) =>
                        !leitor.emprestimos.some(
                            (emprestimo) => emprestimo.atrasado
                        )
                );

            default:
                return leitores;
        }
    }, [leitores, filtro]);

    return (
        <main className="min-h-screen bg-gray-background p-5 dark:bg-navy-background md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Cabeçalho */}
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-space-grotesk text-2xl font-bold text-dark-blue dark:text-white md:text-3xl">
                            Gestão de leitores
                        </h1>

                        <p className="mt-1 text-sm text-text-muted dark:text-text-light">
                            Consulte os leitores cadastrados e acompanhe seus empréstimos.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            atualizarLeitores(buscaAplicada || undefined)
                        }
                        disabled={carregando}
                        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dark-state-blue disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {carregando ? "Atualizando..." : "Atualizar"}
                    </button>
                </header>

                {/* Pesquisa */}
                <section className="rounded-xl border border-gray-stroke bg-white p-5 dark:border-surface-mid dark:bg-surface-dark">
                    <form
                        onSubmit={handleBuscar}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                            placeholder="Pesquisar leitor pelo nome..."
                            className="min-w-0 flex-1 rounded-lg border border-gray-stroke bg-white px-4 py-3 text-sm text-dark-blue outline-none transition-colors placeholder:text-text-muted focus:border-primary dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                        />

                        <button
                            type="submit"
                            disabled={carregando}
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-state-blue disabled:opacity-60"
                        >
                            Pesquisar
                        </button>

                        {buscaAplicada && (
                            <button
                                type="button"
                                onClick={handleLimparBusca}
                                disabled={carregando}
                                className="rounded-lg border border-gray-stroke px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary dark:border-surface-mid dark:text-text-light"
                            >
                                Limpar
                            </button>
                        )}
                    </form>
                </section>

                {/* Mensagem de erro */}
                {erro && (
                    <div
                        role="alert"
                        className="flex items-center justify-between gap-3 rounded-lg border border-warning/30 bg-pale-red p-4 text-sm text-warning dark:bg-unavaiable-red/10"
                    >
                        <span>{erro}</span>

                        <button
                            type="button"
                            onClick={() => setErro("")}
                            aria-label="Fechar mensagem"
                            className="font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Filtros */}
                <section className="space-y-3">
                    <h2 className="font-ubuntu text-lg font-semibold text-dark-blue dark:text-white">
                        Leitores cadastrados
                    </h2>

                    <FiltrosLeitores
                        filtro={filtro}
                        onFiltroChange={setFiltro}
                        contagens={contagens}
                    />
                </section>

                {/* Listagem */}
                {carregando ? (
                    <div className="rounded-xl border border-gray-stroke bg-white p-10 text-center dark:border-surface-mid dark:bg-surface-dark">
                        <p className="text-sm text-text-muted dark:text-text-light">
                            Carregando leitores...
                        </p>
                    </div>
                ) : leitoresFiltrados.length === 0 ? (
                    <div className="rounded-xl border border-gray-stroke bg-white p-10 text-center dark:border-surface-mid dark:bg-surface-dark">
                        <h3 className="font-semibold text-dark-blue dark:text-white">
                            Nenhum leitor encontrado
                        </h3>

                        <p className="mt-2 text-sm text-text-muted dark:text-text-light">
                            {buscaAplicada
                                ? "Não encontramos leitores com esse nome."
                                : filtro === "atrasados"
                                  ? "Não há leitores com empréstimos atrasados."
                                  : filtro === "emDia"
                                    ? "Não há leitores em dia."
                                    : "Ainda não existem leitores cadastrados."}
                        </p>
                    </div>
                ) : (
                        <LeitoresTabela
                        leitores={leitoresFiltrados}
                        onDetalhes={setLeitorSelecionado}
                    />
                )}
            </div>

            {/* Detalhes do leitor */}
            {leitorSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setLeitorSelecionado(null)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-detalhes-leitor"
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-gray-stroke bg-white p-6 shadow-xl dark:border-surface-mid dark:bg-surface-dark"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="titulo-detalhes-leitor"
                                    className="font-space-grotesk text-xl font-bold text-dark-blue dark:text-white"
                                >
                                    Detalhes do leitor
                                </h2>

                                <p className="mt-1 text-sm text-text-muted dark:text-text-light">
                                    Informações cadastrais e empréstimos ativos.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setLeitorSelecionado(null)}
                                aria-label="Fechar detalhes"
                                className="text-2xl text-text-muted hover:text-warning"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-text-muted dark:text-text-light">
                                Nome
                            </p>
                            <p className="font-semibold text-dark-blue dark:text-white">
                                {leitorSelecionado.nome}
                            </p>

                            <p className="pt-2 text-sm text-text-muted dark:text-text-light">
                                E-mail
                            </p>
                            <p className="text-dark-blue dark:text-white">
                                {leitorSelecionado.email}
                            </p>
                        </div>

                        <div className="mt-7">
                            <h3 className="mb-3 font-semibold text-dark-blue dark:text-white">
                                Empréstimos ativos ({leitorSelecionado.emprestimos.length})
                            </h3>

                            {leitorSelecionado.emprestimos.length === 0 ? (
                                <p className="rounded-lg bg-gray-background p-4 text-sm text-text-muted dark:bg-surface-mid dark:text-text-light">
                                    Este leitor não possui empréstimos ativos.
                                </p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-gray-stroke dark:border-surface-mid">
                                    <table className="w-full min-w-[600px] text-left text-sm">
                                        <thead className="bg-gray-background text-text-muted dark:bg-surface-mid dark:text-text-light">
                                            <tr>
                                                <th className="p-3">Livro</th>
                                                <th className="p-3">Tombo</th>
                                                <th className="p-3">Retirada</th>
                                                <th className="p-3">Devolução prevista</th>
                                                <th className="p-3">Situação</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {leitorSelecionado.emprestimos.map(
                                                (emprestimo) => (
                                                    <tr
                                                        key={emprestimo.emprestimo_id}
                                                        className="border-t border-gray-stroke dark:border-surface-mid"
                                                    >
                                                        <td className="p-3 font-medium text-dark-blue dark:text-white">
                                                            {emprestimo.livro}
                                                        </td>

                                                        <td className="p-3 text-text-muted dark:text-text-light">
                                                            {emprestimo.tombo}
                                                        </td>

                                                        <td className="p-3 text-text-muted dark:text-text-light">
                                                            {formatarData(emprestimo.data_retirada)}
                                                        </td>

                                                        <td className="p-3 text-text-muted dark:text-text-light">
                                                            {formatarData(emprestimo.data_prevista_devolucao)}
                                                        </td>

                                                        <td className="p-3">
                                                            <span
                                                                className={
                                                                    emprestimo.atrasado
                                                                        ? "rounded-full bg-pale-red px-2.5 py-1 text-xs font-medium text-unavaiable-red dark:bg-unavaiable-red/15"
                                                                        : "rounded-full bg-pale-green px-2.5 py-1 text-xs font-medium text-vivid-green dark:bg-vivid-green/15"
                                                                }
                                                            >
                                                                {emprestimo.atrasado
                                                                    ? "Atrasado"
                                                                    : "Em dia"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
