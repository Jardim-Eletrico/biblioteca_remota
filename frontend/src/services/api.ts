import { refreshToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL
    ?? "http://127.0.0.1:8000/api";

let refreshEmAndamento: Promise<string> | null = null;

function obterNovoAccess(): Promise<string> {
    if (!refreshEmAndamento) {
        refreshEmAndamento = refreshToken().finally(() => {
            refreshEmAndamento = null;
        });
    }

    return refreshEmAndamento;
}

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {

    const url = `${API_URL}${endpoint}`;

    const accessOriginal = localStorage.getItem("access");

    // Monta e executa a requisição
    function fazerRequisicao(access: string | null) {
        const headers = new Headers(options.headers);

        if (access) {
            headers.set("Authorization", `Bearer ${access}`);
        } else {
            headers.delete("Authorization");
        }

        if (
            options.body &&
            !(options.body instanceof FormData) &&
            !headers.has("Content-Type")
        ) {
            headers.set("Content-Type", "application/json");
        }

        return fetch(url, {
            ...options,
            headers
        });
    }

    let response = await fazerRequisicao(accessOriginal);

    if (response.status !== 401) {
        return response;
    }

    try {
        const accessAtual = localStorage.getItem("access");

        const novoAccess =
            accessAtual && accessAtual !== accessOriginal
                ? accessAtual
                : await obterNovoAccess();

        response = await fazerRequisicao(novoAccess);

        if (response.status === 401) {
            throw new Error("A sessão não pôde ser renovada.");
        }

        return response;

    } catch (error) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        if (window.location.pathname !== "/auth") {
            window.location.assign("/auth");
        }

        throw new Error("Sua sessão expirou. Faça login novamente.");
    }
}