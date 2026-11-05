import type {
    LivroResponse,
    LivroPayload
} from "../types/livro";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

// Listar, pesquisar e ordenar livros
export async function listarLivros(
    ordenar: "titulo" | "melhor_nota" | "popularidade" = "titulo",
    busca: string = ""
): Promise<LivroResponse[]> {

    const params = new URLSearchParams({
        ordenar,
        busca
    });

    const response = await fetch(`${API_URL}/livros/?${params}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar livros.");
    }

    return response.json();
}

// Buscar livro pelo ID
export async function buscarLivro(
    id: number
): Promise<LivroResponse> {

    const response = await fetch(`${API_URL}/livros/${id}/`);

    if (!response.ok) {
        throw new Error("Erro ao buscar livro.");
    }

    return response.json();
}

// Cadastrar livro
export async function cadastrarLivro(
    dados: LivroPayload
): Promise<LivroResponse> {

    const response = await fetch(`${API_URL}/livros/cadastrar/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        throw new Error("Erro ao cadastrar livro.");
    }

    return response.json();
}