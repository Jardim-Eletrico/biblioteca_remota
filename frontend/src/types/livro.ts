export interface LivroResponse {
    id: number;
    titulo: string;
    autor: string;
    isbn: string;
    descricao: string;

    media_avaliacoes: number | null;
    total_emprestimos: number;
}

export interface LivroPayload {
    titulo: string;
    autor: string;
    isbn: string;
    descricao: string;
}
