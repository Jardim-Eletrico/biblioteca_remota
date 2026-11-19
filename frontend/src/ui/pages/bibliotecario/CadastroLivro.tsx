import useCadastrarLivro from "@/src/hooks/bibliotecario/useCadastroLivro";

import FormularioLivro from "@/components/bibliotecario/livros/FormularioLivro";
import ListaEdicoes from "@/components/bibliotecario/livros/ListaEdicoes";
import ResumoCadastro from "@/components/bibliotecario/livros/ResumoCadastro";

export default function CadastroLivro() {
    const {
        livro,
        edicoes,
        cdds,
        carregandoCDDs,
        carregando,
        erro,
        sucesso,
        atualizarLivro,
        atualizarEdicao,
        adicionarEdicao,
        removerEdicao,
        cadastrar,
    } = useCadastrarLivro();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        void cadastrar();
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-surface-dark sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Cabeçalho */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Cadastrar livro
                    </h1>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Cadastre uma nova obra, suas edições e os respectivos
                        exemplares no acervo da biblioteca.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados principais do livro */}
                    <FormularioLivro
                        livro={livro}
                        cdds={cdds}
                        carregandoCDDs={carregandoCDDs}
                        atualizarLivro={atualizarLivro}
                    />

                    {/* Edições */}
                    <ListaEdicoes
                        edicoes={edicoes}
                        atualizarEdicao={atualizarEdicao}
                        adicionarEdicao={adicionarEdicao}
                        removerEdicao={removerEdicao}
                    />

                    {/* Resumo */}
                    <ResumoCadastro
                        livro={livro}
                        edicoes={edicoes}
                    />

                    {/* Mensagens */}
                    {erro && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                        >
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div
                            role="status"
                            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                        >
                            {sucesso}
                        </div>
                    )}

                    {/* Botão de cadastro */}
                    <div className="flex justify-end border-t border-gray-stroke pt-6 dark:border-surface-mid">
                        <button
                            type="submit"
                            disabled={carregando || carregandoCDDs}
                            className="inline-flex min-w-40 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {carregando
                                ? "Cadastrando..."
                                : "Cadastrar livro"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}