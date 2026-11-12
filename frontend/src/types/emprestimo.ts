export type EmprestimoSituacao =
  | "Devolvido"
  | "Atrasado"
  | "Em andamento";

export interface EmprestimoResponse {
  id: number;
  leitor: string;
  livro: string;
  tombo: string;
  data_retirada: string;
  data_prevista_devolucao: string;
  data_devolucao: string | null;
  situacao: EmprestimoSituacao;
}

export interface EfetivarEmprestimoPayload {
  exemplar_id: number;
  codigo_confirmacao: string;
  data_prevista_devolucao?: string;
}

export interface EmprestimoEfetivado {
  id: number;
  pedido_id: number;
  exemplar_id: number;
  tombo: string;
  data_retirada: string;
  data_prevista_devolucao: string;
  data_devolucao: string | null;
}

export interface EfetivarEmprestimoResponse {
  mensagem: string;
  emprestimo: EmprestimoEfetivado;
}

export interface DevolverEmprestimoResponse {
  mensagem: string;
  emprestimo_id: number;
  data_devolucao: string;
  exemplar_id: number;
  status_exemplar: string;
}

