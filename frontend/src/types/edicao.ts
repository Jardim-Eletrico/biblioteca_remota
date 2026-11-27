
export interface EdicaoResponse {
    id: number;
    livro: number;
    ano_publicacao: number;
    editora: string;
    numero_paginas: number;
    edicao: string;
    capa: string | null;
    isbn: string | null;

    total_exemplares: number;
    exemplares_disponiveis: number;
    possui_exemplares_emprestaveis: boolean;

    data_de_criacao: string;
}

export interface EdicaoPayload {
    livro: number;
    ano_publicacao: number;
    editora: string;
    numero_paginas: number;
    edicao: string;
    capa?: File | null;
    isbn: string | null;
}
