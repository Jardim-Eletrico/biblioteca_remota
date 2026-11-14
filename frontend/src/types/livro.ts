
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
    descricao: string;
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
    descricao?: string;
    generos?: string;
    ano_original: string;
}

export interface LivroComEdicoes {
    livro: LivroResponse;
    edicoes: EdicaoResponse[];
}
