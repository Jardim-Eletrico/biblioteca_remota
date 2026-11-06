import type { ExemplarResponse, ExemplarLotePayload, ExemplarFiltroPublico } from "../types/exemplar";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

//METODOS PUBLICOS
export async function listarExemplaresLeitor(edicaoId: number, status: ExemplarFiltroPublico = "todos"): Promise<ExemplarResponse[]> {
    const params = new URLSearchParams({
        status: status
    });

    const response = await fetch(`${API_URL}/edicoes/public/${edicaoId}/exemplares/?${params}`);

    if (!response.ok){
        throw new Error("Erro ao listar exemplares");
    }

    return await response.json();
    
}

export async function buscarExemplarLeitor(exemplarId: number): Promise<ExemplarResponse> {
    const response = await fetch(`${API_URL}/exemplares/public/${exemplarId}/`);

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || data.mensagem || "Erro ao buscar livro"
        );
    }

    return data;
}

