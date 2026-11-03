
const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

import type { LoginResponse, CadastroPayLoad, CadastroResponse } from "../types/api";


export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail ?? "Email ou senha inválidos");
  }

  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh)

  return data;
}

export async function cadastro(payload: CadastroPayLoad): Promise<CadastroResponse> {
  const response = await fetch (`${API_URL}/cadastro/`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok){
    throw new Error(data?.detail ?? "Erro no cadastro");
  }

  return data;
}

export async function refreshToken(): Promise<string> {
  const refresh = localStorage.getItem("refresh");

  if(!refresh) {
    throw new Error("Refresh token não encontrado")
  }
  
  const response = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( {refresh} )
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    logoutLocal();
    throw new Error("Não foi possível renovar a sessão");
  }

  localStorage.setItem("access", data.access);

  if (data.refresh) {
    localStorage.setItem("refresh", data.refresh);
  }

  return data.access;
}

function logoutLocal() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export async function logout() {
  const access = localStorage.getItem("acess");
  const refresh = localStorage.getItem("refresh");

  try {
    if (access && refresh) {
      await fetch(`${API_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access},`
        },
        body: JSON.stringify({refresh}),
      });
    }
  }
  finally {
    logoutLocal();
  }
}

