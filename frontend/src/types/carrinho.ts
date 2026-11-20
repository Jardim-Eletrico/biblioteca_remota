export interface ItemCarrinho {
    id: number;
    edicaoId: number;
    livroId: number;
    titulo: string;
    editora: string;
    capa: string | null;
    exemplaresDisponiveis: number;
    cdd: string | null;
}
