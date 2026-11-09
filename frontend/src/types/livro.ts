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