import type {
    EdicaoResponse,
    EdicaoPayload
} from "@/src/types/edicao";

import { apiFetch } from "./api";

// =====================================================
// CRIAR FORMDATA
// =====================================================

function criarFormData(
    payload: EdicaoPayload | Partial<EdicaoPayload>
): FormData {
    const formData = new FormData();

    if (payload.livro !== undefined) {
        formData.append("livro", String(payload.livro));
    }

    if (payload.ano_publicacao !== undefined) {
        formData.append("ano_publicacao", String(payload.ano_publicacao));
    }

    if (payload.editora !== undefined) {
        formData.append("editora", payload.editora);
    }

    if (payload.numero_paginas !== undefined && payload.numero_paginas !== null) {
        formData.append("numero_paginas", String(payload.numero_paginas));
    }

    if (payload.edicao !== undefined && payload.edicao !== null) {
        formData.append("edicao", String(payload.edicao));
    }

    if (payload.isbn !== undefined && payload.isbn !== null) {
        formData.append("isbn", payload.isbn);
    }

    if (payload.capa instanceof File) {
        formData.append("capa", payload.capa);
    }

    return formData;
}

// =====================================================
// LISTAR EDIÇÕES
// =====================================================

export async function listarEdicoes(): Promise<EdicaoResponse[]> {
    const response = await apiFetch("/edicoes/");

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar edições"
        );
    }

    return data;
}

// =====================================================
// BUSCAR EDIÇÃO
// =====================================================

export async function buscarEdicao(id: number): Promise<EdicaoResponse> {
    const response = await apiFetch(`/edicoes/${id}/`);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao buscar edição"
        );
    }

    return data;
}

// =====================================================
// ATUALIZAR EDIÇÃO
// =====================================================

export async function atualizarEdicao(
    id: number,
    payload: EdicaoPayload
): Promise<EdicaoResponse> {
    const response = await apiFetch(`/edicoes/${id}/`, {
        method: "PUT",
        body: criarFormData(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao atualizar edição"
        );
    }

    return data;
}

// =====================================================
// ATUALIZAR EDIÇÃO PARCIALMENTE
// =====================================================

export async function atualizarEdicaoParcial(
    id: number,
    payload: Partial<EdicaoPayload>
): Promise<EdicaoResponse> {
    const response = await apiFetch(`/edicoes/${id}/`, {
        method: "PATCH",
        body: criarFormData(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao atualizar edição"
        );
    }

    return data;
}

// =====================================================
// EXCLUIR EDIÇÃO
// =====================================================

export async function excluirEdicao(id: number): Promise<void> {
    const response = await apiFetch(`/edicoes/${id}/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao excluir edição."
        );
    }
}

// =====================================================
// CADASTRAR EDIÇÃO
// =====================================================

export async function cadastrarEdicao(
    payload: EdicaoPayload
): Promise<EdicaoResponse> {
    const response = await apiFetch("/edicoes/", {
        method: "POST",
        body: criarFormData(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao cadastrar edição."
        );
    }

    return data;
}