import type {
    LivroResponse, LivroPayload, LivrosPaginados
} from '@/src/types/livro';

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

// FUNÇÃO AUXILIAR PARA REQUISIÇÕES AUTENTICADAS
async function requisicaoAutenticada(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const access = localStorage.getItem("access");

    if (!access) {
        throw new Error("Token de autenticação não encontrado");
    }

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${access}`,
        },
    });
}

// LISTAR LIVROS
export async function listarLivros(
    offset: number = 0,
    busca: string = ""
): Promise<LivrosPaginados> {
    const response = await requisicaoAutenticada(
        `${API_URL}/livros/?limit=10&offset=${offset}&search=${encodeURIComponent(busca)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao buscar livros"
        );
    }

    return data;
}

// BUSCAR LIVRO POR ID
export async function buscarLivro(id: number): Promise<LivroResponse> {
    const response = await requisicaoAutenticada(`${API_URL}/livros/${id}/`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao buscar livro"
        );
    }

    return data;
}

// ATUALIZAR LIVRO
export async function atualizarLivro(
    id: number,
    payload: LivroPayload
): Promise<LivroResponse> {
    const response = await requisicaoAutenticada(`${API_URL}/livros/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || 'Erro ao atualizar'
        );
    }

    return data;
}

// ATUALIZAR LIVRO PARCIALMENTE
export async function atualizarLivroParcial(
    id: number,
    payload: Partial<LivroPayload>
): Promise<LivroResponse> {
    const response = await requisicaoAutenticada(`${API_URL}/livros/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || 'Erro ao atualizar'
        );
    }

    return data;
}

// EXCLUIR LIVRO
export async function excluirLivro(id: number): Promise<void> {
    const response = await requisicaoAutenticada(`${API_URL}/livros/${id}/`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.detail ||
            data.erro ||
            "Erro ao excluir livro."
        );
    }
}

// CADASTRAR LIVRO
export async function cadastrarLivro(
    payload: LivroPayload
): Promise<LivroResponse> {
    const response = await requisicaoAutenticada(`${API_URL}/livros/cadastrar/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.erro ||
            "Erro ao cadastrar livro."
        );
    }

    return data;
}
