import type { AvaliacaoPayload, AvaliacaoResponse } from "../types/avaliacao";
import { apiFetch } from "./api";

function extrairMensagemErro(dados: unknown): string | null {

    if (typeof dados === "string") {
        return dados;
    }

    if (Array.isArray(dados)) {
        const mensagens = dados
            .map(extrairMensagemErro)
            .filter((mensagem): mensagem is string => mensagem !== null);

        return mensagens.join(" ");
    }

    if (dados && typeof dados === "object") {
        const objeto = dados as Record<string, unknown>;

        const campos = [
            "detail",
            "erro",
            "mensagem",
            "nota",
            "non_field_errors"
        ];

        for (const campo of campos) {
            const mensagem = extrairMensagemErro(objeto[campo]);

            if (mensagem) {
                return mensagem;
            }
        }

        for (const chave of Object.keys(objeto)) {
            if (/^\d+$/.test(chave)) {
                const mensagem = extrairMensagemErro(objeto[chave]);

                if (mensagem) {
                    return mensagem;
                }
            }
        }
    }

    return null;
}


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
        throw new Error(
            extrairMensagemErro(data) ?? "Erro ao avaliar livro"
        );
    }

    return data as AvaliacaoResponse;
}