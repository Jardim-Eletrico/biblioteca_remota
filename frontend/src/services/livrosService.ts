
import type {
    LivroResponse,
    LivroPayload,
    CDDResponse,
    LivroComEdicoes,
    LivrosPaginados,
    LivroRecomendadoResponse
} from "@/src/types/livro";

import type {
    EdicaoResponse,
    EdicaoPayload,
} from "@/src/types/edicao";

import { apiFetch } from "./api";

// =====================================================
// LISTAR LIVROS
// =====================================================

export async function listarLivros(
    offset: number = 0,
    busca: string = "",
    ordenacao: string = ""
): Promise<LivrosPaginados> {
    const params = new URLSearchParams({
        limit: "10",
        offset: String(offset),
        search: busca,
        ordenacao: ordenacao
    });

    const response = await apiFetch(`/livros/?${params.toString()}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar livros"
        );
    }

    return data;
}

// =====================================================
// BUSCAR LIVRO
// =====================================================

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

// =====================================================
// ATUALIZAR LIVRO
// =====================================================

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

// =====================================================
// ATUALIZAR LIVRO PARCIALMENTE
// =====================================================

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

// =====================================================
// EXCLUIR LIVRO
// =====================================================

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

// =====================================================
// CADASTRAR LIVRO
// =====================================================

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

// =====================================================
// BUSCAR LIVROS RECOMENDADOS
// =====================================================

export async function buscarLivrosRecomendados(
    livroId: number
): Promise<LivroRecomendadoResponse[]> {
    const response = await apiFetch(
        `/livros/${livroId}/recomendados/`
    );

    const texto = await response.text();
    const data = texto ? JSON.parse(texto) : null;

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            `Erro HTTP ${response.status}: ${texto}`
        );
    }

    return data;
}

// =====================================================
// LISTAR CDDs
// =====================================================

export async function listarCDDs(): Promise<CDDResponse[]> {
    const response = await apiFetch("/cdds/");
    const dados = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error("Não foi possível carregar os CDDs.");
    }

    return dados;
}

// =====================================================
// CADASTRAR EDIÇÃO
// =====================================================

export async function cadastrarEdicao(
    payload: EdicaoPayload
): Promise<EdicaoResponse> {
    const formData = new FormData();

    formData.append("livro", String(payload.livro));
    formData.append("ano_publicacao", String(payload.ano_publicacao));
    formData.append("editora", payload.editora);
    formData.append("numero_paginas", String(payload.numero_paginas));
    formData.append("edicao", payload.edicao);
    formData.append("isbn", payload.isbn ?? "");

    if (payload.capa) {
        formData.append("capa", payload.capa);
    }

    const response = await apiFetch("/edicoes/", {
        method: "POST",
        body: formData,
    });

    const dados = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            dados?.detail ||
            dados?.erro ||
            "Não foi possível cadastrar a edição."
        );
    }

    return dados;
}
