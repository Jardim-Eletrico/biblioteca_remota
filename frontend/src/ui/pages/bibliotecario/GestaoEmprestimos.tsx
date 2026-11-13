
import { useEffect, useState } from "react";

import type { PedidoResponse } from "@/src/types/pedido";
import type {
  EmprestimoResponse,
  FiltroEmprestimo,
} from "@/src/types/emprestimo";
import type { ExemplarPublicoResponse } from "@/src/types/exemplar";

import PedidoCard from "@/components/bibliotecario/emprestimos/PedidoCard";
import EmprestimoTabela from "@/components/bibliotecario/emprestimos/EmprestimosTabela";
import ModalEfetivarEmprestimo from "@/components/bibliotecario/emprestimos/ModalEfetivarEmprestimo";

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

export default function GestaoEmprestimos() {
  const [aba, setAba] = useState<Aba>("pedidos");

  // Filtro mantido no componente pai para não ser perdido
  // quando a tabela for desmontada e montada novamente.
  const [filtroEmprestimos, setFiltroEmprestimos] =
    useState<FiltroEmprestimo>("Todos");

  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoResponse[]>([]);

  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [carregandoEmprestimos, setCarregandoEmprestimos] = useState(true);

  const [pedidoEmAcao, setPedidoEmAcao] = useState<number | null>(null);
  const [emprestimoEmAcao, setEmprestimoEmAcao] = useState<number | null>(null);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Estados do modal de efetivação.
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<PedidoResponse | null>(null);

  const [exemplares, setExemplares] =
    useState<ExemplarPublicoResponse[]>([]);

  const [exemplarSelecionado, setExemplarSelecionado] =
    useState<number | "">("");

  const [dataPrevista, setDataPrevista] = useState("");
  const [codigoConfirmacao, setCodigoConfirmacao] = useState("");

  const [carregandoExemplares, setCarregandoExemplares] = useState(false);

  // Carregar pedidos.
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

  // Carregar empréstimos.
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

  // Atualizar os dados da página.
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

  // Abrir modal e buscar o exemplar reservado para o pedido.
  async function abrirModalEfetivacao(pedido: PedidoResponse) {
    setErro("");
    setSucesso("");

    setPedidoSelecionado(pedido);
    setExemplares([]);
    setExemplarSelecionado("");
    setDataPrevista("");
    setCodigoConfirmacao("");
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

  // Fechar modal.
  function fecharModal() {
    setPedidoSelecionado(null);
    setExemplares([]);
    setExemplarSelecionado("");
    setDataPrevista("");
    setCodigoConfirmacao("");
  }

  // Efetivar empréstimo.
  async function handleEfetivar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!pedidoSelecionado || !exemplarSelecionado) {
      setErro("Selecione um exemplar para continuar.");
      return;
    }

    if (!/^\d{6}$/.test(codigoConfirmacao)) {
      setErro("Informe um código de confirmação válido com 6 dígitos.");
      return;
    }

    setErro("");
    setSucesso("");
    setPedidoEmAcao(pedidoSelecionado.id);

    try {
      const payload = {
        exemplar_id: exemplarSelecionado,
        codigo_confirmacao: codigoConfirmacao,
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
              <EmprestimoTabela
                emprestimos={emprestimos}
                emprestimoEmAcao={emprestimoEmAcao}
                onDevolver={handleDevolver}
                filtro={filtroEmprestimos}
                onFiltroChange={setFiltroEmprestimos}
              />
            )}
          </section>
        )}
      </div>

      {/* Modal de efetivação */}
      {pedidoSelecionado && (
        <ModalEfetivarEmprestimo
          pedido={pedidoSelecionado}
          exemplares={exemplares}
          exemplarSelecionado={exemplarSelecionado}
          dataPrevista={dataPrevista}
          codigoConfirmacao={codigoConfirmacao}
          carregandoExemplares={carregandoExemplares}
          pedidoEmAcao={pedidoEmAcao}
          onFechar={fecharModal}
          onExemplarChange={setExemplarSelecionado}
          onDataPrevistaChange={setDataPrevista}
          onCodigoConfirmacaoChange={setCodigoConfirmacao}
          onSubmit={handleEfetivar}
        />
      )}
    </main>
  );
}
