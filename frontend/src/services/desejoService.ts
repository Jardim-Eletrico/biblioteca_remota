import type {
    ListaDesejoResponse,
    ListaDesejoCreate
} from '@/src/types/desejo'

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

// LISTAR DESEJOS
export async function listarDesejos(): Promise<ListaDesejoResponse[]> {
    const response = await fetch(`${API_URL}/desejos/`, {
        headers: obterHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao buscar lista de desejos"
        );
    }

    return data;
}

// ADICIONAR DESEJO
export async function adicionarDesejo(
    payload: ListaDesejoCreate
): Promise<ListaDesejoResponse> {
    const response = await fetch(`${API_URL}/desejos/`, {
        method: "POST",
        headers: obterHeaders(),
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao adicionar à lista de desejos"
        );
    }

    return data;
}

// REMOVER DESEJO
export async function removerDesejo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/desejos/${id}/`, {
        method: "DELETE",
        headers: obterHeaders()
    });

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.detail || data.erro || "Erro ao remover desejo"
        );
    }
}