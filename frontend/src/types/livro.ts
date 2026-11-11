import type { EdicaoResponse } from "./edicao";

export interface LivroResponse {
    id: number;
    titulo: string;
    subtitulo: string | null;
    autor: string;
    descricao: string | null;
    ano_original: number;

    media_avalicaoes: number | null;
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
}