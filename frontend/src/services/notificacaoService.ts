
import type {
    NotificacaoResponse
} from "@/src/types/notificacoes";

import { apiFetch } from "./api";

// LISTAR NOTIFICAÇÕES
export async function listarNotificacoes(): Promise<NotificacaoResponse[]> {
    const response = await apiFetch("/notificacoes/");

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar notificações"
        );
    }

    return data;
}

// MARCAR COMO LIDA
export async function marcarNotificacaoComoLida(
    id: number
): Promise<NotificacaoResponse> {

    const response = await apiFetch(`/notificacoes/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ lida: true })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao marcar notificação como lida"
        );
    }

    return data;
}

// EXCLUIR NOTIFICAÇÃO
export async function excluirNotificacao(id: number): Promise<void> {

    const response = await apiFetch(`/notificacoes/${id}/excluir/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.detail || data?.erro || "Erro ao excluir notificação"
        );
    }
}
