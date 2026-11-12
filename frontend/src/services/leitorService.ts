
import { apiFetch } from "./api";

import type { LeitorResponse } from "../types/leitor";

function obterMensagemErro(
    dados: any,
    mensagemPadrao: string
): string {
    if (!dados) return mensagemPadrao;

    if (typeof dados.detail === "string") {
        return dados.detail;
    }

    if (typeof dados.erro === "string") {
        return dados.erro;
    }

    if (typeof dados.mensagem === "string") {
        return dados.mensagem;
    }

    if (Array.isArray(dados.non_field_errors)) {
        return dados.non_field_errors.join(" ");
    }

    return mensagemPadrao;
}

// Lista todos os leitores e seus empréstimos ativos.
export async function listarLeitores(): Promise<LeitorResponse[]> {
    const response = await apiFetch("/leitores/");

    const dados = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível listar os leitores.")
        );
    }

    return dados;
}

// Busca leitores pelo nome.
export async function buscarLeitores(
    nome: string
): Promise<LeitorResponse[]> {
    const parametro = encodeURIComponent(nome.trim());

    const response = await apiFetch(
        `/leitores/buscar/?nome=${parametro}`
    );

    const dados = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível buscar os leitores.")
        );
    }

    return dados;
}
