import type { EdicaoResponse } from "./edicao";

export interface LivroResponse {
    id: number;
    titulo: string;
    subtitulo: string | null;
    autor: string;
    descricao: string | null;
    ano_original: string;

    media_avalicoes: number | null;
    quantidade_avaliacoes: number;
    total_emprestimos: number;
}

export interface LivroPayload {
    titulo: string;
    subtitulo?: string | null;
    autor: string;
    descricao?: string | null;
    ano_original: string;
}

export interface LivroComEdicao {
    livro: LivroResponse;
    edicao: EdicaoResponse;
}