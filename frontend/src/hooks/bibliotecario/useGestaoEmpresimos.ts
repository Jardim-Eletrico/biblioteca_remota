
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

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
    regularizarEmprestimo,
} from "@/src/services/emprestimoService";

import { listarExemplaresDaEdicao } from "@/src/services/exemplaresService";

export default function useGestaoEmprestimo() {
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [emprestimos, setEmprestimos] = useState<EmprestimoResponse[]>([]);

    const [carregandoPedidos, setCarregandoPedidos] = useState(true);
    const [carregandoEmprestimos, setCarregandoEmprestimos] = useState(true);
    const [carregandoExemplares, setCarregandoExemplares] = useState(false);

    const [pedidoEmAcao, setPedidoEmAcao] = useState<number | null>(null);
    const [emprestimoEmAcao, setEmprestimoEmAcao] = useState<number | null>(null);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    // Modal de efetivação
    const [pedidoSelecionado, setPedidoSelecionado] =
        useState<PedidoResponse | null>(null);

    const [exemplares, setExemplares] =
        useState<ExemplarPublicoResponse[]>([]);

    const [exemplarSelecionado, setExemplarSelecionado] =
        useState<number | "">("");

    const [dataPrevista, setDataPrevista] = useState("");
    const [codigoConfirmacao, setCodigoConfirmacao] = useState("");

    // Modal de regularização
    const [emprestimoSelecionado, setEmprestimoSelecionado] =
        useState<EmprestimoResponse | null>(null);

    const [motivoRegularizacao, setMotivoRegularizacao] = useState("");

    const carregarPedidos = useCallback(async () => {
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
    }, []);

    const carregarEmprestimos = useCallback(async () => {
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
    }, []);

    const atualizarDados = useCallback(async () => {
        await Promise.all([
            carregarPedidos(),
            carregarEmprestimos(),
        ]);
    }, [carregarPedidos, carregarEmprestimos]);

    useEffect(() => {
        void atualizarDados();
    }, [atualizarDados]);

    async function handleRecusar(pedidoId: number) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja recusar este pedido?"
        );

        if (!confirmar) return;

        setErro("");
        setSucesso("");
        setPedidoEmAcao(pedidoId);

        try {
            await responderPedido(pedidoId, { status: "recusado" });

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

    function fecharModal() {
        setPedidoSelecionado(null);
        setExemplares([]);
        setExemplarSelecionado("");
        setDataPrevista("");
        setCodigoConfirmacao("");
    }

    async function handleEfetivar(e: FormEvent<HTMLFormElement>) {
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

            await efetivarEmprestimo(pedidoSelecionado.id, payload);

            setSucesso("Empréstimo efetivado com sucesso.");
            fecharModal();

            await atualizarDados();
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

    // Abrir modal de regularização
    function abrirModalRegularizacao(emprestimo: EmprestimoResponse) {
        setErro("");
        setSucesso("");
        setMotivoRegularizacao("");
        setEmprestimoSelecionado(emprestimo);
    }

    // Fechar modal de regularização
    function fecharModalRegularizacao() {
        setEmprestimoSelecionado(null);
        setMotivoRegularizacao("");
    }

    // Regularizar empréstimo
    async function handleRegularizar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!emprestimoSelecionado) return;

        const motivo = motivoRegularizacao.trim();

        if (!motivo) {
            setErro("Informe o motivo da regularização.");
            return;
        }

        const emprestimoId = emprestimoSelecionado.id;

        setErro("");
        setSucesso("");
        setEmprestimoEmAcao(emprestimoId);

        try {
            await regularizarEmprestimo(emprestimoId, {
                motivo_regularizacao: motivo,
            });

            setSucesso("Empréstimo regularizado com sucesso.");
            fecharModalRegularizacao();

            await carregarEmprestimos();
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível regularizar o empréstimo."
            );
        } finally {
            setEmprestimoEmAcao(null);
        }
    }

    return {
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
    };
}
