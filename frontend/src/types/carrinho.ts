
export interface ItemCarrinho {
    edicaoId: number;
    livroId: number;
    titulo: string;
    editora: string;
    capa: string | null;
    exemplaresDisponiveis: number;
}
