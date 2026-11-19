
import useGestaoLivros from "@/src/hooks/bibliotecario/useGestaoLivros";

import TabelaLivros from "@/components/bibliotecario/livros/TabelaLivros";
import DetalhesLivro from "@/components/bibliotecario/livros/DetalhesLivro";

export default function GestaoLivros() {
    const gestao = useGestaoLivros();

    const edicoesSelecionadas = gestao.livroSelecionado
        ? gestao.edicoes.filter(
            (edicao) => edicao.livro === gestao.livroSelecionado?.id
        )
        : [];

    return (
        <main className="space-y-6 p-4 md:p-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gestão do acervo
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Consulte, organize e atualize os livros e suas edições.
                </p>
            </header>

            {gestao.erro && (
                <div
                    role="alert"
                    className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                >
                    <span>{gestao.erro}</span>

                    <button
                        type="button"
                        onClick={() => gestao.setErro(null)}
                        className="font-medium"
                    >
                        Fechar
                    </button>
                </div>
            )}

            {gestao.sucesso && (
                <div
                    role="status"
                    className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
                >
                    <span>{gestao.sucesso}</span>

                    <button
                        type="button"
                        onClick={() => gestao.setSucesso(null)}
                        className="font-medium"
                    >
                        Fechar
                    </button>
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Resumo
                    titulo="Livros cadastrados"
                    valor={gestao.livros.length}
                />

                <Resumo
                    titulo="Edições cadastradas"
                    valor={gestao.edicoes.length}
                />

                <Resumo
                    titulo="Exemplares cadastrados"
                    valor={gestao.edicoes.reduce(
                        (total, edicao) => total + edicao.total_exemplares,
                        0
                    )}
                />
            </section>

            {gestao.carregando ? (
                <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    Carregando acervo...
                </div>
            ) : (
                <TabelaLivros
                    livros={gestao.livrosFiltrados}
                    pesquisa={gestao.pesquisa}
                    setPesquisa={gestao.setPesquisa}
                    filtroCDD={gestao.filtroCDD}
                    setFiltroCDD={gestao.setFiltroCDD}
                    filtroGenero={gestao.filtroGenero}
                    setFiltroGenero={gestao.setFiltroGenero}
                    cddsDisponiveis={gestao.cddsDisponiveis}
                    generosDisponiveis={gestao.generosDisponiveis}
                    onDetalhes={gestao.selecionarLivro}
                />
            )}

            {gestao.livroSelecionado && (
                <DetalhesLivro
                    livro={gestao.livroSelecionado}
                    edicoes={edicoesSelecionadas}
                    onFechar={() => gestao.selecionarLivro(null)}
                    onSalvarLivro={gestao.atualizarLivro}
                    onSalvarEdicao={gestao.atualizarEdicao}
                    onCriarEdicao={gestao.criarEdicao}
                    onAtualizarDados={gestao.carregarDados}
                    salvando={gestao.salvando}
                />
            )}
        </main>
    );
}

function Resumo({
    titulo,
    valor,
}: {
    titulo: string;
    valor: number;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {titulo}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {valor}
            </p>
        </div>
    );
}
