import type { PedidoPayload, PedidoResponse } from "../types/pedido";

import { apiFetch } from "./api";

// CRIAR PEDIDO
export async function criarPedido(
    payload: PedidoPayload
): Promise<PedidoResponse> {

    const response = await apiFetch("/pedidos/", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const mensagem =
            data?.detail ||
            data?.erro ||
            data?.edicao?.[0] ||
            "Erro ao solicitar reserva";

        throw new Error(mensagem);
    }

    return data;
}