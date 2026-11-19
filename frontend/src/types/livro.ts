
import type { EdicaoResponse } from "./edicao";

export interface CDDResponse {
    id: number;
    codigo: string;
    descricao: string;
    pai: number | null;
}

export interface LivroResponse {
    id: number;
    cdd: number | null;
    titulo: string;
    subtitulo: string;
    autor: string;
    descricao: string | null;
    generos: string;
    ano_original: string;

    media_avaliacoes: number | null;
    quantidade_avaliacoes: number;
}

export interface LivroPayload {
    cdd?: number | null;
    titulo: string;
    subtitulo?: string;
    autor: string;
    descricao?: string | null;
    generos?: string;
    ano_original: number | string;
}

export interface LivroComEdicoes extends LivroResponse {
    edicoes: EdicaoResponse[];
}

export interface LivroComEdicao extends LivroResponse {
    edicoes: EdicaoResponse[];
}

export interface LivrosPaginados {
    count: number;
    next: string | null;
    previous: string | null;
    results: LivroComEdicoes[];
}
