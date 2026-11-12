
export interface EmprestimoLeitorResponse {
    emprestimo_id: number;
    livro: string;
    tombo: string;
    data_retirada: string;
    data_prevista_devolucao: string;
    atrasado: boolean;
}

export interface LeitorResponse {
    id: number;
    nome: string;
    email: string;
    emprestimos: EmprestimoLeitorResponse[];
}

export interface BuscarLeitorError {
    erro: string;
}
