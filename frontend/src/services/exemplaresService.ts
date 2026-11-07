import type { ExemplarResponse, ExemplarLotePayload, ExemplarFiltroPublico, ExemplarFiltroAdmin, ExemplarBaixaPayload } from "../types/exemplar";

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

//METODOS BIBLIOTECARIO
export async function criarExemplaresLote(edicaoId: number, payload: ExemplarLotePayload) {
    const response = await fetch(`${API_URL}/edicoes/${edicaoId}/exemplares/`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || "Erro ao criar exemplares"
        );
    }

    return data;
}

export async function listarExemplaresBibliotecario(
    situacao: ExemplarFiltroAdmin = "nao_baixados",
    search?: string
): Promise<ExemplarResponse[]> {

    const params = new URLSearchParams({
        situacao: situacao
    });

    if (search) {
        params.append("search", search);
    }

    const response = await fetch(
        `${API_URL}/exemplares/?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || data.erro || "Erro ao listar exemplares"
        );
    }

    return data;
}

export async function buscarExemplarBibliotecario(exemplarId: number): Promise<ExemplarResponse> {
    const response = await fetch(`${API_URL}/exemplares/${exemplarId}/`);

    const data = await response.json();

    if (!response.ok){
        throw new Error(
            data.detail || data.erro || data.mensagem || "Erro ao buscar livro"
        );
    }

    return data;
}

export async function deletarExemplar(
    exemplarId: number
): Promise<void> {

    const response = await fetch(
        `${API_URL}/exemplares/${exemplarId}/`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao excluir exemplar"
        );
    }
}

export async function baixarExemplar(
    exemplarId: number,
    payload: ExemplarBaixaPayload
): Promise<{ mensagem: string }> {

    const response = await fetch(
        `${API_URL}/exemplares/${exemplarId}/baixa/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.erro ||
            data.mensagem ||
            "Erro ao baixar exemplar"
        );
    }

    return data;
}


