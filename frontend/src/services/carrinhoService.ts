import { apiFetch } from "./api";
import type { ItemCarrinho } from "@/src/types/carrinho";

// =====================================================
// LISTAR ITENS DO CARRINHO
// =====================================================

export async function listarItensCarrinho(): Promise<ItemCarrinho[]> {
    const response = await apiFetch("/carrinho/");

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar carrinho."
        );
    }

    return data;
}

// =====================================================
// ADICIONAR ITEM AO CARRINHO
// =====================================================

export async function adicionarItemCarrinho(
    edicaoId: number
): Promise<ItemCarrinho> {

    const response = await apiFetch("/carrinho/", {
        method: "POST",
        body: JSON.stringify({
            edicao: edicaoId
        })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao adicionar item ao carrinho."
        );
    }

    return data;
}

// =====================================================
// REMOVER ITEM DO CARRINHO
// =====================================================

export async function removerItemCarrinho(
    itemId: number
): Promise<void> {
    const response = await apiFetch(`/carrinho/${itemId}/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.detail || data?.erro || "Erro ao remover item do carrinho."
        );
    }
}