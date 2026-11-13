export interface EdicaoResponse {
    id: number;
    livro: number;
    ano_publicacao: number;
    editora: string;
    numero_paginas: number | null;
    edicao: number | null;
    capa: string | null;
    isbn: string | null;

    total_exemplares: number;
    exemplares_disponiveis: number;

    data_de_criacao: string;
}

export interface EdicaoPayload {
    livro: number;
    ano_publicacao: number;
    editora: string;
    numero_paginas: number | null;
    edicao: number | null;
    capa?: File | null;
    isbn: string | null;
}