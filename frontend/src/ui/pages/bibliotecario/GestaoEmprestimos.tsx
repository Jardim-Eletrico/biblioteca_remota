
import { useEffect, useState } from "react";

import type { PedidoResponse } from "@/src/types/pedido";
import type { EmprestimoResponse } from "@/src/types/emprestimo";
import type { ExemplarPublicoResponse } from "@/src/types/exemplar";

import {
  listarPedidosAtivos,
  responderPedido,
  cancelarPedido,
} from "@/src/services/pedidoService";

import {
  listarEmprestimos,
  efetivarEmprestimo,
  devolverEmprestimo,
} from "@/src/services/emprestimoService";

import { listarExemplaresDaEdicao } from "@/src/services/exemplaresService";

type Aba = "pedidos" | "emprestimos";

function formatarData(data: string | null): string {
  if (!data) return "—";

  const dataFormatada = data.includes("T")
    ? new Date(data)
    : new Date(`${data}T00:00:00`);

  return dataFormatada.toLocaleDateString("pt-BR");
}

function StatusBadge({ status }: { status: string }) {
  const estilos: Record<string, string> = {
    pendente:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    aprovado:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    recusado:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    cancelado:
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    "Em andamento":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Atrasado:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    Devolvido:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        estilos[status] ??
        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

export default function GestaoEmprestimos() {
  const [aba, setAba] = useState<Aba>("pedidos");

  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoResponse[]>([]);

  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [carregandoEmprestimos, setCarregandoEmprestimos] =
    useState(true);

  const [pedidoEmAcao, setPedidoEmAcao] = useState<number | null>(null);
  const [emprestimoEmAcao, setEmprestimoEmAcao] =
    useState<number | null>(null);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Modal de efetivação.
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<PedidoResponse | null>(null);

  const [exemplares, setExemplares] =
    useState<ExemplarPublicoResponse[]>([]);

  const [exemplarSelecionado, setExemplarSelecionado] =
    useState<number | "">("");

  const [dataPrevista, setDataPrevista] = useState("");
  const [carregandoExemplares, setCarregandoExemplares] =
    useState(false);

  async function carregarPedidos() {
    setCarregandoPedidos(true);

    try {
      const dados = await listarPedidosAtivos();
      setPedidos(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os pedidos."
      );
    } finally {
      setCarregandoPedidos(false);
    }
  }

  async function carregarEmprestimos() {
    setCarregandoEmprestimos(true);

    try {
      const dados = await listarEmprestimos();
      setEmprestimos(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os empréstimos."
      );
    } finally {
      setCarregandoEmprestimos(false);
    }
  }

  async function atualizarDados() {
  await Promise.all([
    carregarPedidos(),
    carregarEmprestimos(),
  ]);
}

  useEffect(() => {
    void atualizarDados();
  }, []);

  // Recusar pedido pendente.
  async function handleRecusar(pedidoId: number) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja recusar este pedido?"
    );

    if (!confirmar) return;

    setErro("");
    setSucesso("");
    setPedidoEmAcao(pedidoId);

    try {
      await responderPedido(pedidoId, {
        status: "recusado",
      });

      setSucesso("Pedido recusado com sucesso.");

      await carregarPedidos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível recusar o pedido."
      );
    } finally {
      setPedidoEmAcao(null);
    }
  }

  // Cancelar pedido.
  async function handleCancelar(pedidoId: number) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja cancelar este pedido?"
    );

    if (!confirmar) return;

    setErro("");
    setSucesso("");
    setPedidoEmAcao(pedidoId);

    try {
      await cancelarPedido(pedidoId);

      setSucesso("Pedido cancelado com sucesso.");

      await carregarPedidos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar o pedido."
      );
    } finally {
      setPedidoEmAcao(null);
    }
  }

  // Abrir modal e buscar exemplares disponíveis.
 // Abrir modal e buscar o exemplar reservado para o pedido.
async function abrirModalEfetivacao(pedido: PedidoResponse) {
  setErro("");
  setSucesso("");

  setPedidoSelecionado(pedido);
  setExemplares([]);
  setExemplarSelecionado("");
  setDataPrevista("");
  setCarregandoExemplares(true);

  try {
    const dados = await listarExemplaresDaEdicao(
      pedido.edicao,
      "todos"
    );

    const exemplarReservado = dados.filter(
      (exemplar) =>
        exemplar.id === pedido.exemplar &&
        exemplar.status === "reservado"
    );

    setExemplares(exemplarReservado);

    if (exemplarReservado.length === 1) {
      setExemplarSelecionado(exemplarReservado[0].id);
    } else {
      setErro(
        "Não foi encontrado o exemplar reservado para este pedido."
      );
    }
  } catch (error) {
    setErro(
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os exemplares."
    );

    setPedidoSelecionado(null);
  } finally {
    setCarregandoExemplares(false);
  }
}

  function fecharModal() {
    setPedidoSelecionado(null);
    setExemplares([]);
    setExemplarSelecionado("");
    setDataPrevista("");
  }

  // Efetivar empréstimo.
  async function handleEfetivar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!pedidoSelecionado || !exemplarSelecionado) {
      setErro("Selecione um exemplar para continuar.");
      return;
    }

    setErro("");
    setSucesso("");
    setPedidoEmAcao(pedidoSelecionado.id);

    try {
      const payload = {
        exemplar_id: exemplarSelecionado,
        ...(dataPrevista
          ? { data_prevista_devolucao: dataPrevista }
          : {}),
      };

      await efetivarEmprestimo(
        pedidoSelecionado.id,
        payload
      );

      setSucesso("Empréstimo efetivado com sucesso.");

      fecharModal();

      await Promise.all([
        carregarPedidos(),
        carregarEmprestimos(),
      ]);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível efetivar o empréstimo."
      );
    } finally {
      setPedidoEmAcao(null);
    }
  }

  // Registrar devolução.
  async function handleDevolver(emprestimoId: number) {
    const confirmar = window.confirm(
      "Confirma o registro da devolução deste empréstimo?"
    );

    if (!confirmar) return;

    setErro("");
    setSucesso("");
    setEmprestimoEmAcao(emprestimoId);

    try {
      await devolverEmprestimo(emprestimoId);

      setSucesso("Devolução registrada com sucesso.");

      await carregarEmprestimos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a devolução."
      );
    } finally {
      setEmprestimoEmAcao(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Gestão de empréstimos
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gerencie os pedidos e acompanhe os empréstimos da biblioteca.
            </p>
          </div>

          <button
            type="button"
            onClick={atualizarDados}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Atualizar
          </button>
        </div>

        {/* Mensagens */}
        {erro && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          >
            {erro}
            <button
              type="button"
              onClick={() => setErro("")}
              className="ml-3 font-semibold underline"
            >
              Fechar
            </button>
          </div>
        )}

        {sucesso && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
          >
            {sucesso}
            <button
              type="button"
              onClick={() => setSucesso("")}
              className="ml-3 font-semibold underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Abas */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setAba("pedidos")}
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition ${
              aba === "pedidos"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Pedidos ({pedidos.length})
          </button>

          <button
            type="button"
            onClick={() => setAba("emprestimos")}
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition ${
              aba === "emprestimos"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Empréstimos ({emprestimos.length})
          </button>
        </div>

        {/* Conteúdo: Pedidos */}
        {aba === "pedidos" && (
          <section>
            {carregandoPedidos ? (
              <p className="py-12 text-center text-gray-500 dark:text-gray-400">
                Carregando pedidos...
              </p>
            ) : pedidos.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <h2 className="font-semibold">
                  Nenhum pedido ativo
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Os pedidos pendentes e aprovados aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pedidos.map((pedido) => (
                  <article
                    key={pedido.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pedido #{pedido.id}
                        </p>

                        <h2 className="mt-1 font-semibold">
                          {pedido.titulo}
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {pedido.autor}
                        </p>
                      </div>

                      <StatusBadge status={pedido.status} />
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
                      <p>
                        <span className="text-gray-500 dark:text-gray-400">
                          Leitor:{" "}
                        </span>
                        {pedido.nome_leitor}
                      </p>

                      <p>
                        <span className="text-gray-500 dark:text-gray-400">
                          Edição:{" "}
                        </span>
                        {pedido.edicao}
                      </p>

                      <p>
                        <span className="text-gray-500 dark:text-gray-400">
                          Data do pedido:{" "}
                        </span>
                        {formatarData(pedido.data_pedido)}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {pedido.status === "pendente" && (
                        <button
                          type="button"
                          disabled={pedidoEmAcao === pedido.id}
                          onClick={() => handleRecusar(pedido.id)}
                          className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                        >
                          Recusar
                        </button>
                      )}

                      {pedido.status === "aprovado" && (
                        <button
                          type="button"
                          disabled={pedidoEmAcao === pedido.id}
                          onClick={() => abrirModalEfetivacao(pedido)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          Efetivar empréstimo
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={pedidoEmAcao === pedido.id}
                        onClick={() => handleCancelar(pedido.id)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Conteúdo: Empréstimos */}
        {aba === "emprestimos" && (
          <section>
            {carregandoEmprestimos ? (
              <p className="py-12 text-center text-gray-500 dark:text-gray-400">
                Carregando empréstimos...
              </p>
            ) : emprestimos.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <h2 className="font-semibold">
                  Nenhum empréstimo encontrado
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Os empréstimos realizados aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-4">Leitor</th>
                      <th className="px-5 py-4">Livro</th>
                      <th className="px-5 py-4">Tombo</th>
                      <th className="px-5 py-4">Retirada</th>
                      <th className="px-5 py-4">Devolução prevista</th>
                      <th className="px-5 py-4">Situação</th>
                      <th className="px-5 py-4">Ação</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {emprestimos.map((emprestimo) => (
                      <tr
                        key={emprestimo.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      >
                        <td className="px-5 py-4 font-medium">
                          {emprestimo.leitor}
                        </td>

                        <td className="px-5 py-4">
                          {emprestimo.livro}
                        </td>

                        <td className="px-5 py-4">
                          {emprestimo.tombo}
                        </td>

                        <td className="px-5 py-4">
                          {formatarData(emprestimo.data_retirada)}
                        </td>

                        <td className="px-5 py-4">
                          {formatarData(
                            emprestimo.data_prevista_devolucao
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={emprestimo.situacao} />
                        </td>

                        <td className="px-5 py-4">
                          {emprestimo.situacao !== "Devolvido" ? (
                            <button
                              type="button"
                              disabled={
                                emprestimoEmAcao === emprestimo.id
                              }
                              onClick={() =>
                                handleDevolver(emprestimo.id)
                              }
                              className="whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                              Registrar devolução
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Devolvido em{" "}
                              {formatarData(emprestimo.data_devolucao)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modal de efetivação */}
      {pedidoSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) fecharModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="modal-titulo"
                  className="text-xl font-bold"
                >
                  Efetivar empréstimo
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {pedidoSelecionado.titulo}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                className="text-xl text-gray-500 hover:text-gray-900 dark:hover:text-white"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {carregandoExemplares ? (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                Carregando exemplares disponíveis...
              </p>
            ) : exemplares.length === 0 ? (
              <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Não existem exemplares disponíveis para esta edição.
              </div>
            ) : (
              <form onSubmit={handleEfetivar}>
                <div className="mb-4">
                  <label
                    htmlFor="exemplar"
                    className="mb-2 block text-sm font-medium"
                  >
                    Selecione o exemplar
                  </label>

                  <select
                    id="exemplar"
                    required
                    value={exemplarSelecionado}
                    onChange={(e) =>
                      setExemplarSelecionado(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <option value="">
                      Selecione um exemplar
                    </option>

                    {exemplares.map((exemplar) => (
                      <option
                        key={exemplar.id}
                        value={exemplar.id}
                      >
                        Tombo: {exemplar.tombo} — {exemplar.editora} ({exemplar.ano_publicacao})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="data-prevista"
                    className="mb-2 block text-sm font-medium"
                  >
                    Data prevista de devolução
                  </label>

                  <input
                    id="data-prevista"
                    type="date"
                    value={dataPrevista}
                    onChange={(e) => setDataPrevista(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  />

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Opcional. Se não preencher, será utilizada a data padrão do sistema.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={!exemplarSelecionado || pedidoEmAcao !== null}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {pedidoEmAcao === pedidoSelecionado.id
                      ? "Efetivando..."
                      : "Confirmar empréstimo"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
