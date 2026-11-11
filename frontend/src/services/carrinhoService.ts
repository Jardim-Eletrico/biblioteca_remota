
import { criarPedido } from "./pedidoService";

import type { PedidoResponse } from "@/src/types/pedido";

// =====================================================
// TIPOS
// =====================================================

interface FalhaReserva {
    edicaoId: number;
    mensagem: string;
}

interface ResultadoCarrinho {
    pedidosCriados: PedidoResponse[];
    falhas: FalhaReserva[];
}


// =====================================================
// FINALIZAR CARRINHO
// =====================================================

export async function finalizarCarrinho(
    edicaoIds: number[]
): Promise<ResultadoCarrinho> {

    const pedidosCriados: PedidoResponse[] = [];
    const falhas: FalhaReserva[] = [];

    // Processar cada edição individualmente
    for (const edicaoId of edicaoIds) {

        try {

            const pedido = await criarPedido({
                edicao: edicaoId
            });

            pedidosCriados.push(pedido);

        } catch (error) {

            falhas.push({
                edicaoId,
                mensagem: error instanceof Error
                    ? error.message
                    : "Erro ao solicitar reserva."
            });

        }
    }

    return {
        pedidosCriados,
        falhas
    };
}
