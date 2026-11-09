
import type {
    LivroResponse,
    LivroPayload
} from "@/src/types/livro";

import { apiFetch } from "./api";

// LISTAR LIVROS
export async function listarLivros(): Promise<LivroResponse[]> {
    const response = await apiFetch("/livros/");

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar livros"
        );
    }

    return data;
}

// BUSCAR LIVRO
export async function buscarLivro(id: number): Promise<LivroResponse> {
    const response = await apiFetch(`/livros/${id}/`);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar livro"
        );
    }

    return data;
}

// ATUALIZAR LIVRO
export async function atualizarLivro(
    id: number,
    payload: LivroPayload
): Promise<LivroResponse> {

    const response = await apiFetch(`/livros/${id}/`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao atualizar livro"
        );
    }

    return data;
}

// ATUALIZAR LIVRO PARCIALMENTE
export async function atualizarLivroParcial(
    id: number,
    payload: Partial<LivroPayload>
): Promise<LivroResponse> {

    const response = await apiFetch(`/livros/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao atualizar livro"
        );
    }

    return data;
}

// EXCLUIR LIVRO
export async function excluirLivro(id: number): Promise<void> {
    const response = await apiFetch(`/livros/${id}/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.detail || data?.erro || "Erro ao excluir livro."
        );
    }
}

// CADASTRAR LIVRO
export async function cadastrarLivro(
    payload: LivroPayload
): Promise<LivroResponse> {

    const response = await apiFetch("/livros/cadastrar/", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao cadastrar livro."
        );
    }

    return data;
}
