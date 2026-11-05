import type {EdicaoResponse, EdicaoPayload} from '@/src/types/edicao';

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

function criarFormData(payload: EdicaoPayload | Partial<EdicaoPayload>) {
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

export async function listarEdicoes(): Promise<EdicaoResponse[]> {
    const response = await fetch(`${API_URL}/edicoes/`);

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || "Erro ao buscar edições"
        );

    }
    return data
}

export async function buscarEdicao(id: number): Promise<EdicaoResponse> {
    const response = await fetch(`${API_URL}/edicoes/${id}/`);

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || "Erro ao buscar edição"
        );

    }
    return data
}

export async function atualizarEdicao(id: number, payload:EdicaoPayload): Promise<EdicaoResponse> {
    const response = await fetch(`${API_URL}/edicoes/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: criarFormData(payload)
    });

    const data = await response.json();
    if (!response.ok){
        throw new Error(
            data.detail || data.erro || 'Erro ao atualizar'
        );
    }

    return data;
    
}

export async function atualizarEdicaoParcial(id: number, payload:Partial<EdicaoPayload>): Promise<EdicaoResponse> {
    const response = await fetch(`${API_URL}/edicoes/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: criarFormData(payload)
    });

    const data = await response.json();
    if (!response.ok){
        throw new Error(
            data.detail || data.erro || 'Erro ao atualizar'
        );
    }
    
    return data;
}

export async function excluirEdicao(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/edicoes/${id}/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.detail ||
            data.erro ||
            "Erro ao excluir edição."
        );
    }
}

export async function cadastrarEdicao(payload: EdicaoPayload): Promise<EdicaoResponse> {
    const response = await fetch(`${API_URL}/edicoes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: criarFormData(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.erro ||
            "Erro ao cadastrar edição."
        );
    }

    return data;
}