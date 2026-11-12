import { apiFetch } from "./api";

import type {
  PedidoResponse,
  PedidoResponderPayload,
  PedidoResponderResponse,
  PedidoCancelarResponse,
} from "../types/pedido";

interface ListaPaginada<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function obterMensagemErro(
  dados: any,
  mensagemPadrao: string
): string {
  if (!dados) return mensagemPadrao;

  if (typeof dados.detail === "string") {
    return dados.detail;
  }

  if (typeof dados.erro === "string") {
    return dados.erro;
  }

  if (typeof dados.mensagem === "string") {
    return dados.mensagem;
  }

  if (Array.isArray(dados.non_field_errors)) {
    return dados.non_field_errors.join(" ");
  }

  return mensagemPadrao;
}

function normalizarLista<T>(
  dados: T[] | ListaPaginada<T>
): T[] {
  return Array.isArray(dados) ? dados : dados.results;
}

// Lista todos os pedidos ativos para o bibliotecário.
export async function listarPedidosAtivos(): Promise<PedidoResponse[]> {
  const response = await apiFetch("/pedidos/ativos/");

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      obterMensagemErro(dados, "Não foi possível listar os pedidos.")
    );
  }

  return normalizarLista<PedidoResponse>(dados);
}

// Recusa um pedido pendente.
export async function responderPedido(
  pedidoId: number,
  payload: PedidoResponderPayload
): Promise<PedidoResponderResponse> {
  const response = await apiFetch(
    `/pedidos/${pedidoId}/responder/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      obterMensagemErro(dados, "Não foi possível responder ao pedido.")
    );
  }

  return dados;
}

// Cancela um pedido.
export async function cancelarPedido(
  pedidoId: number
): Promise<PedidoCancelarResponse> {
  const response = await apiFetch(
    `/pedidos/${pedidoId}/cancelar/`,
    {
      method: "POST",
    }
  );

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      obterMensagemErro(dados, "Não foi possível cancelar o pedido.")
    );
  }

  return dados;
}