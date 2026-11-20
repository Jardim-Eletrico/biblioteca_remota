export interface AvaliacaoPayload {
    nota: number;
}

export interface AvaliacaoResponse {
    mensagem: string;
    avaliacao_id: number;
    livro_id: number;
    nota: number;
    data_avaliacao: string;
}


export interface PermissaoAvaliacaoResponse {
    pode_avaliar: boolean;
    ja_avaliou: boolean;
    pode_editar: boolean;
    nota_atual: number | null;
    data_avaliacao: string | null;
    mensagem: string;
}