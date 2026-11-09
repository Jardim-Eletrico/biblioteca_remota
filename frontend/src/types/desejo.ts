export interface ListaDesejoResponse {
    id: number;
    edicao: number;
    titulo: string;
    autor: string;
    capa: string | null;
    cdd: string | null;
    tem_exemplares_disponiveis: boolean;
    data_adicao: string;
}

export interface ListaDesejoCreate {
    edicao: number;
}