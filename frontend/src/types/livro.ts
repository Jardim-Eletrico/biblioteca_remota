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
    ano_original: number;
}

export interface LivroComEdicoes extends LivroResponse {
    edicoes: EdicaoResponse[];
}

export interface LivrosPaginados {
    count: number;
    next: string | null;
    previous: string | null;
    results: LivroComEdicoes[];
    ano_original: string;
}

export interface LivroComEdicao {
    livro: LivroResponse;
    edicao: EdicaoResponse;
}