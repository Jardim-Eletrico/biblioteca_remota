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

export function logout(){
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

