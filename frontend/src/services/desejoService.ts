
import type {
    ListaDesejoResponse,
    ListaDesejoCreate
} from "@/src/types/desejo";

import { apiFetch } from "./api";


// =====================================================
// LISTAR DESEJOS
// =====================================================

export async function listarDesejos(): Promise<ListaDesejoResponse[]> {

    const response = await apiFetch("/desejos/");

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao buscar lista de desejos"
        );
    }

    return data;
}


// =====================================================
// ADICIONAR DESEJO
// =====================================================

export async function adicionarDesejo(
    payload: ListaDesejoCreate
): Promise<ListaDesejoResponse> {

    const response = await apiFetch("/desejos/", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao adicionar à lista de desejos"
        );
    }

    return data;
}


// =====================================================
// REMOVER DESEJO
// =====================================================

export async function removerDesejo(id: number): Promise<void> {

    const response = await apiFetch(`/desejos/${id}/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao remover desejo"
        );
    }
}
