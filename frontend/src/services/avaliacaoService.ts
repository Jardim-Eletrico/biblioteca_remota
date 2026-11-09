import type { AvaliacaoPayload, AvaliacaoResponse } from "../types/avaliacao";
import { apiFetch } from "./api";

export async function avaliarLivro(livroId: number, payLoad: AvaliacaoPayload):Promise<AvaliacaoResponse> {

    const response = await apiFetch(
        `/livros/${livroId}/avaliar/`,
        {
            method: "POST",
            body: JSON.stringify(payLoad)
        }
    );

    const data = await response.json().catch(() => null);

    if(!response.ok){
        const mensagem = 
        data?.detail ||
        data?.erro ||
        data?.nota?.[0] ||
        data?.non_field_errors?.[0] ||
        "Erro ao avaliar livro";


        throw new Error (typeof mensagem === "string" ? mensagem : "Erro ao avaliar livro");
    }

    return data as AvaliacaoResponse;
}