import type { EmprestimoResumoResponse } from "./emprestimo";

export type PedidoStatus =
  | "pendente"
  | "aprovado"
  | "recusado"
  | "cancelado";

export interface PedidoPayload {
    edicoes: number[];
    prazo: 1 | 2;
}

export interface PedidoResponse {
  id: number;
  leitor: number;
  nome_leitor: string;
  edicao: number;
  titulo: string;
  autor: string;
  capa: string;
  status: PedidoStatus;
  data_pedido: string;
  data_resposta: string | null;
  exemplar: number | null;
  emprestimo: EmprestimoResumoResponse | null;
  prazo_semanas: 1 | 2;
}

export interface PedidoResponderPayload {
  status: "recusado";
}

export interface PedidoResponderResponse {
  mensagem: string;
  pedido_id: number;
  status: PedidoStatus;
  data_resposta: string;
}

export interface PedidoCancelarResponse {
    mensagem: string;
    pedido: PedidoResponse;
}