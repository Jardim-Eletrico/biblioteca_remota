import type {
    LivroResponse, LivroPayload
} from '@/src/types/livro'


const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export async function listarLivros(): Promise<LivroResponse[]> {
    const response = await fetch(`${API_URL}/livros/`);

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || "Erro ao buscar livros"
        );

    }
    return data
}

export async function buscarLivro(id: number): Promise<LivroResponse> {
    const response = await fetch(`${API_URL}/livros/${id}/`);

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || "Erro ao buscar livro"
        );

    }
    return data
}

export async function atualizarLivro(id: number, payload:LivroPayload): Promise<LivroResponse> {
    const response = await fetch(`${API_URL}/livros/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok){
        throw new Error(
            data.detail || data.erro || 'Erro ao atualizar'
        );
    }

    return data;
    
}

export async function atualizarLivroParcial(id: number, payload:Partial<LivroPayload>): Promise<LivroResponse> {
    const response = await fetch(`${API_URL}/livros/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok){
        throw new Error(
            data.detail || data.erro || 'Erro ao atualizar'
        );
    }
    
    return data;
}

export async function excluirLivro(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/livros/${id}/`, {
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

export async function cadastrarLivro(payload: LivroPayload): Promise<LivroResponse> {
    const response = await fetch(`${API_URL}/livros/cadastrar/`, {
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