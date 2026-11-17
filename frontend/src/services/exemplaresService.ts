
import type {
    ExemplarResponse,
    ExemplarLotePayload,
    ExemplarFiltroPublico,
    ExemplarFiltroAdmin,
    ExemplarBaixaPayload
} from "../types/exemplar";

import { apiFetch } from "./api";

const API_URL = import.meta.env.VITE_API_URL
    ?? "http://127.0.0.1:8000/api";


// =====================================================
// MÉTODOS PÚBLICOS
// =====================================================

// LISTAR EXEMPLARES PARA LEITORES
export async function listarExemplaresLeitor(
    edicaoId: number,
    status: ExemplarFiltroPublico = "todos"
): Promise<ExemplarResponse[]> {

    const params = new URLSearchParams({
        status: status
    });

    const response = await fetch(
        `${API_URL}/edicoes/public/${edicaoId}/exemplares/?${params}`
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao listar exemplares"
        );
    }

    return data;
}


// BUSCAR EXEMPLAR PARA LEITORES
export async function buscarExemplarLeitor(
    exemplarId: number
): Promise<ExemplarResponse> {

    const response = await fetch(
        `${API_URL}/exemplares/public/${exemplarId}/`
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            data?.mensagem ||
            "Erro ao buscar exemplar"
        );
    }

    return data;
}


// =====================================================
// MÉTODOS DO BIBLIOTECÁRIO
// =====================================================

// CRIAR EXEMPLARES EM LOTE
export async function criarExemplaresLote(
    edicaoId: number,
    payload: ExemplarLotePayload
) {

    const response = await apiFetch(
        `/edicoes/${edicaoId}/exemplares/`,
        {
            method: "POST",
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao criar exemplares"
        );
    }

    return data;
}


// LISTAR EXEMPLARES PARA BIBLIOTECÁRIOS
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

    const response = await apiFetch(
        `/exemplares/?${params}`
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.erro || "Erro ao listar exemplares"
        );
    }

    return data;
}


// BUSCAR EXEMPLAR PARA BIBLIOTECÁRIOS
export async function buscarExemplarBibliotecario(
    exemplarId: number
): Promise<ExemplarResponse> {

    const response = await apiFetch(
        `/exemplares/${exemplarId}/`
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            data?.mensagem ||
            "Erro ao buscar exemplar"
        );
    }

    return data;
}


// EXCLUIR EXEMPLAR
export async function deletarExemplar(
    exemplarId: number
): Promise<void> {

    const response = await apiFetch(
        `/exemplares/${exemplarId}/`,
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


// DAR BAIXA EM EXEMPLAR
export async function baixarExemplar(
    exemplarId: number,
    payload: ExemplarBaixaPayload
): Promise<{ mensagem: string }> {

    const response = await apiFetch(
        `/exemplares/${exemplarId}/baixa/`,
        {
            method: "POST",
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.erro ||
            data?.mensagem ||
            "Erro ao baixar exemplar"
        );
    }

    return data;
}



import type { ExemplarPublicoResponse } from "../types/exemplar";

// Lista os exemplares de uma edição.
export async function listarExemplaresDaEdicao(
  edicaoId: number,
  status: ExemplarFiltroPublico = "disponivel"
): Promise<ExemplarPublicoResponse[]> {
  const response = await apiFetch(
    `/edicoes/public/${edicaoId}/exemplares/?status=${status}`
  );

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      dados?.detail ||
      dados?.erro ||
      "Não foi possível listar os exemplares."
    );
  }

  return Array.isArray(dados) ? dados : dados.results;
}