export type ExemplarStatus =
    | "disponivel"
    | "reservado"
    | "emprestado"
    | "indisponivel"
    | "baixado";

export type ExemplarFiltroPublico =
    | "disponivel"
    | "emprestado"
    | "todos";

export type ExemplarFiltroAdmin =
    | "baixado"
    | "nao_baixados"
    | "todos";

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

    data_baixa: string | null;
    motivo_baixa: string | null;
}

export interface ExemplarLotePayload {
    quantidade: number;
}

export interface ExemplarBaixaPayload {
    motivo_baixa: string;
}

export interface ExemplarPublicoResponse {
  id: number;
  tombo: string;
  status: ExemplarStatus;
  titulo: string;
  autor: string;
  ano_publicacao: number;
  editora: string;
}