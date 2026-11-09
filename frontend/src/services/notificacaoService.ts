import type {
    NotificacaoResponse
} from '@/src/types/notificacoes'

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

function obterHeaders(): HeadersInit {
    const access = localStorage.getItem("access");

    return {
        "Content-Type": "application/json",
        ...(access && {
            Authorization: `Bearer ${access}`
        })
    };
}

// LISTAR NOTIFICAÇÕES
export async function listarNotificacoes(): Promise<NotificacaoResponse[]> {
    const response = await fetch(`${API_URL}/notificacoes/`, {
        headers: obterHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao buscar notificações"
        );
    }

    return data;
}

// MARCAR COMO LIDA
export async function marcarNotificacaoComoLida(
    id: number
): Promise<NotificacaoResponse> {
    const response = await fetch(`${API_URL}/notificacoes/${id}/`, {
        method: "PATCH",
        headers: obterHeaders(),
        body: JSON.stringify({ lida: true })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao marcar notificação como lida"
        );
    }

    return data;
}

// EXCLUIR NOTIFICAÇÃO
export async function excluirNotificacao(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/notificacoes/${id}/excluir/`, {
        method: "DELETE",
        headers: obterHeaders()
    });

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.detail || data.erro || "Erro ao excluir notificação"
        );
    }
}