// URL base da API.
// Caso VITE_API_URL não esteja definida no .env, utiliza o endereço local.
const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

import type { LoginResponse, CadastroPayLoad, CadastroResponse } from "../types/api";


// =====================================================
// LOGIN
// =====================================================

export async function login(email: string, password: string): Promise<LoginResponse> {

  // Envia as credenciais do usuário para o endpoint de login.
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Converte a resposta do servidor para JSON.
  // Caso a resposta não contenha um JSON válido, retorna null.
  const data = await response.json().catch(() => null);

  // Verifica se a requisição foi bem-sucedida.
  // Caso contrário, lança um erro com a mensagem enviada pelo backend.
  if (!response.ok) {
    throw new Error(data?.detail ?? "Email ou senha inválidos");
  }

  // Armazena os tokens de autenticação no navegador.
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  // Retorna os dados recebidos do servidor.
  return data;
}


// =====================================================
// CADASTRO
// =====================================================

export async function cadastro(payload: CadastroPayLoad): Promise<CadastroResponse> {

  // Envia os dados do formulário de cadastro para o backend.
  const response = await fetch(`${API_URL}/cadastro/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Converte a resposta do servidor para JSON.
  const data = await response.json().catch(() => null);

  // Verifica se houve algum erro durante o cadastro.
  if (!response.ok) {
    throw new Error(data?.detail ?? "Erro no cadastro");
  }

  // Retorna os dados do cadastro realizado.
  return data;
}


// =====================================================
// RENOVAÇÃO DO TOKEN
// =====================================================

export async function refreshToken(): Promise<string> {

  // Recupera o refresh token armazenado no navegador.
  const refresh = localStorage.getItem("refresh");

  // Impede a tentativa de renovação caso não exista um refresh token.
  if (!refresh) {
    throw new Error("Refresh token não encontrado");
  }

  // Envia o refresh token para o endpoint responsável pela renovação.
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  // Converte a resposta do servidor para JSON.
  const data = await response.json().catch(() => null);

  // Caso a renovação falhe, encerra a sessão localmente.
  if (!response.ok) {
    logoutLocal();
    throw new Error("Não foi possível renovar a sessão");
  }

  // Atualiza o access token com o novo token recebido.
  localStorage.setItem("access", data.access);

  // Alguns backends também retornam um novo refresh token.
  // Nesse caso, substitui o token antigo.
  if (data.refresh) {
    localStorage.setItem("refresh", data.refresh);
  }

  // Retorna o novo access token.
  return data.access;
}


// =====================================================
// ENCERRAMENTO LOCAL DA SESSÃO
// =====================================================

function logoutLocal() {

  // Remove os tokens armazenados no navegador.
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}


// =====================================================
// LOGOUT
// =====================================================

export async function logout() {

  // Recupera os tokens necessários para solicitar o logout ao backend.
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  try {

    // Só envia a requisição se os dois tokens estiverem disponíveis.
    if (access && refresh) {

      // Informa ao backend qual usuário está solicitando o logout.
      const response = await fetch(`${API_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });

      // Opcional: verificar se o backend aceitou a solicitação.
      if (!response.ok) {
        throw new Error("Erro ao encerrar a sessão no servidor");
      }
    }

  } finally {

    // Independentemente do resultado da requisição,
    // remove os tokens do navegador.
    logoutLocal();
  }
}