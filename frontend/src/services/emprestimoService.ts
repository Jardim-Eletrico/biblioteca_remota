import { apiFetch } from "./api";

import type {
  EmprestimoResponse,
  EfetivarEmprestimoPayload,
  EfetivarEmprestimoResponse,
  DevolverEmprestimoResponse,
} from "../types/emprestimo";

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

// Lista os empréstimos.
export async function listarEmprestimos(): Promise<EmprestimoResponse[]> {
  const response = await apiFetch("/emprestimos/");

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      obterMensagemErro(dados, "Não foi possível listar os empréstimos.")
    );
  }

  return normalizarLista<EmprestimoResponse>(dados);
}

// Efetiva o empréstimo de um pedido aprovado.
export async function efetivarEmprestimo(
  pedidoId: number,
  payload: EfetivarEmprestimoPayload
): Promise<EfetivarEmprestimoResponse> {
  const response = await apiFetch(
    `/pedidos/${pedidoId}/efetivar_emprestimo/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      obterMensagemErro(dados, "Não foi possível efetivar o empréstimo.")
    );
  }

  return dados;
}

// Registra a devolução de um empréstimo.
export async function devolverEmprestimo(
  emprestimoId: number
): Promise<DevolverEmprestimoResponse> {
  const response = await apiFetch(
    `/emprestimos/${emprestimoId}/devolver`,
    {
      method: "POST",
    }
  );

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      obterMensagemErro(dados, "Não foi possível registrar a devolução.")
    );
  }

  return dados;
}