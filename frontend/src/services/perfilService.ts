
const API_URL = import.meta.env.VITE_API_URL;

import type { PerfilResponse } from "../types/perfil";

export async function buscarPerfil(): Promise<PerfilResponse> {
    const access = localStorage.getItem("access");

    if (!access) {
        throw new Error("Token de autenticação não encontrado");
    }

    console.log("Token existe?", !!access);
    console.log("Token inicial:", access.substring(0, 15));

    const response = await fetch(`${API_URL}/perfil/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        console.log("Status:", response.status);
        console.log("Resposta:", data);

        throw new Error(
            data?.detail ||
            data?.erro ||
            "Erro ao buscar perfil"
        );
    }

    return data;
}


export async function atualizarPerfil(
    dados: Pick<PerfilResponse, "nome" | "email">
): Promise<PerfilResponse> {
    const access = localStorage.getItem("access");

    if (!access) {
        throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_URL}/perfil/`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${access}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.email?.[0] ||
            data?.nome?.[0] ||
            data?.detail ||
            data?.erro ||
            "Erro ao atualizar perfil"
        );
    }

    return data;
}