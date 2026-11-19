
import { useState } from "react";

import type { FiltroEmprestimo } from "@/src/types/emprestimo";

import useGestaoEmprestimo from "@/src/hooks/bibliotecario/useGestaoEmpresimos";

import PedidoCard from "@/components/bibliotecario/emprestimos/PedidoCard";
import EmprestimoTabela from "@/components/bibliotecario/emprestimos/EmprestimosTabela";
import ModalEfetivarEmprestimo from "@/components/bibliotecario/emprestimos/ModalEfetivarEmprestimo";
import ModalRegularizarEmprestimo from "@/components/bibliotecario/emprestimos/ModalRegularizarEmprestimo";

export default function GestaoEmprestimos() {
    const [aba, setAba] = useState<"pedidos" | "emprestimos">("pedidos");
    const [filtroEmprestimos, setFiltroEmprestimos] =
        useState<FiltroEmprestimo>("Todos");

    const {
        pedidos,
        emprestimos,

        carregandoPedidos,
        carregandoEmprestimos,
        carregandoExemplares,

        pedidoEmAcao,
        emprestimoEmAcao,

        erro,
        sucesso,
        setErro,
        setSucesso,

        pedidoSelecionado,
        exemplares,
        exemplarSelecionado,
        setExemplarSelecionado,

        dataPrevista,
        setDataPrevista,

        codigoConfirmacao,
        setCodigoConfirmacao,

        emprestimoSelecionado,
        motivoRegularizacao,
        setMotivoRegularizacao,

        atualizarDados,
        handleRecusar,
        handleCancelar,

        abrirModalEfetivacao,
        fecharModal,
        handleEfetivar,

        handleDevolver,

        abrirModalRegularizacao,
        fecharModalRegularizacao,
        handleRegularizar,
    } = useGestaoEmprestimo();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gestão de empréstimos
                </h1>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Gerencie os pedidos e acompanhe os empréstimos da biblioteca.
                </p>
            </div>

            {erro && (
                <div className="flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                    <span>{erro}</span>

                    <button
                        type="button"
                        onClick={() => setErro("")}
                        className="ml-4 font-semibold hover:opacity-70"
                    >
                        Fechar
                    </button>
                </div>
            )}

            {sucesso && (
                <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
                    <span>{sucesso}</span>

                    <button
                        type="button"
                        onClick={() => setSucesso("")}
                        className="ml-4 font-semibold hover:opacity-70"
                    >
                        Fechar
                    </button>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-6">
                    <button
                        type="button"
                        onClick={() => setAba("pedidos")}
                        className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                            aba === "pedidos"
                                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        Pedidos
                    </button>

                    <button
                        type="button"
                        onClick={() => setAba("emprestimos")}
                        className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                            aba === "emprestimos"
                                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        Empréstimos
                    </button>
                </div>
                
            </div>

            {aba === "pedidos" && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Pedidos de reserva
                    </h2>

                    {carregandoPedidos ? (
                        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Carregando pedidos...
                        </p>
                    ) : pedidos.length === 0 ? (
                        <p className="rounded-lg border border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                            Nenhum pedido encontrado.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {pedidos.map((pedido) => (
                                <PedidoCard
                                    key={pedido.id}
                                    pedido={pedido}
                                    pedidoEmAcao={pedidoEmAcao}
                                    onRecusar={handleRecusar}
                                    onCancelar={handleCancelar}
                                    onEfetivar={abrirModalEfetivacao}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {aba === "emprestimos" && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Empréstimos registrados
                    </h2>

                    {carregandoEmprestimos ? (
                        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Carregando empréstimos...
                        </p>
                    ) : (
                        <EmprestimoTabela
                            emprestimos={emprestimos}
                            emprestimoEmAcao={emprestimoEmAcao}
                            onDevolver={handleDevolver}
                            onRegularizar={abrirModalRegularizacao}
                            filtro={filtroEmprestimos}
                            onFiltroChange={setFiltroEmprestimos}
                        />
                    )}
                </section>
            )}

            {pedidoSelecionado && (
                <ModalEfetivarEmprestimo
                    pedido={pedidoSelecionado}
                    exemplares={exemplares}
                    exemplarSelecionado={exemplarSelecionado}
                    dataPrevista={dataPrevista}
                    carregandoExemplares={carregandoExemplares}
                    pedidoEmAcao={pedidoEmAcao}
                    codigoConfirmacao={codigoConfirmacao}
                    onFechar={fecharModal}
                    onExemplarChange={setExemplarSelecionado}
                    onDataPrevistaChange={setDataPrevista}
                    onCodigoConfirmacaoChange={setCodigoConfirmacao}
                    onSubmit={handleEfetivar}
                />
            )}

            {emprestimoSelecionado && (
                <ModalRegularizarEmprestimo
                    livro={emprestimoSelecionado.livro}
                    leitor={emprestimoSelecionado.leitor}
                    motivo={motivoRegularizacao}
                    carregando={
                        emprestimoEmAcao === emprestimoSelecionado.id
                    }
                    onMotivoChange={setMotivoRegularizacao}
                    onFechar={fecharModalRegularizacao}
                    onSubmit={handleRegularizar}
                />
            )}
        </div>
    );
}
