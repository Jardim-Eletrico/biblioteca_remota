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