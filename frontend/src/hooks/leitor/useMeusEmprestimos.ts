
import { useCallback, useEffect, useMemo, useState } from "react";

import type { PedidoResponse } from "@/src/types/pedido";

import {
    listarMeusPedidos,
    cancelarPedido as cancelarPedidoService,
} from "@/src/services/pedidoService";

type FiltroMeusEmprestimos = "ativos" | "devolvidos";

export default function useMeusEmprestimos() {
    // Dados
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);

    // Filtro
    const [filtro, setFiltro] =
        useState<FiltroMeusEmprestimos>("ativos");

    // Controle da interface
    const [carregando, setCarregando] = useState(true);
    const [cancelandoId, setCancelandoId] = useState<number | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    // Carregar pedidos e empréstimos
    const carregarDados = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);

            const dados = await listarMeusPedidos();

            setPedidos(dados);
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar seus pedidos e empréstimos."
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    // Filtrar registros
    const pedidosFiltrados = useMemo(() => {
        if (filtro === "devolvidos") {
            return pedidos.filter(
                (pedido) =>
                    pedido.emprestimo?.situacao_encerramento === "devolvido"
            );
        }

        return pedidos.filter((pedido) => {
            if (pedido.status === "pendente") {
                return true;
            }

            if (pedido.status !== "aprovado") {
                return false;
            }

            // Pedido aprovado que ainda não virou empréstimo.
            if (!pedido.emprestimo) {
                return true;
            }

            // Empréstimo ainda não encerrado.
            return (
                pedido.emprestimo.data_devolucao === null &&
                pedido.emprestimo.situacao_encerramento === null
            );
        });
    }, [pedidos, filtro]);

    // Verificar se o pedido pode ser cancelado
    function podeCancelarPedido(pedido: PedidoResponse) {
        return (
            (pedido.status === "pendente" || pedido.status === "aprovado") && !pedido.emprestimo
        );
    }

    // Cancelar pedido
    async function cancelar(id: number) {
        try {
            setCancelandoId(id);
            setErro(null);
            setSucesso(null);

            const resposta = await cancelarPedidoService(id);

            setPedidos((anteriores) =>
                anteriores.map((pedido) =>
                    pedido.id === id ? resposta.pedido : pedido
                )
            );

            setSucesso(resposta.mensagem);

            return true;
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao cancelar o pedido."
            );

            return false;
        } finally {
            setCancelandoId(null);
        }
    }

    return {
        pedidos,
        pedidosFiltrados,

        filtro,
        setFiltro,

        carregando,
        cancelandoId,
        erro,
        sucesso,

        setErro,
        setSucesso,

        carregarDados,
        cancelar,
        podeCancelarPedido,
    };
}
