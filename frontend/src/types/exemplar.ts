export type ExemplarStatus =
    | "disponivel"
    | "reservado"
    | "emprestado"
    | "indisponivel";

export interface ExemplarResponse {
    id: number;
    tombo: string;
    status: ExemplarStatus;

    titulo: string;
    autor: string;
    ano_original: number | null;

    ano_publicacao: number;
    editora: string;
    numero_edicao: number | null;
    capa: string | null;

    emprestado: boolean;
    leitor: string | null;
}

export interface ExemplarLotePayload {
    quantidade: number;
}