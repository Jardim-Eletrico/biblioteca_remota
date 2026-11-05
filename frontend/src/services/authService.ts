import type {
    LoginResponse,
    CadastroPayLoad,
    CadastroResponse,
    RecuperarSenhaPayload,
    RecuperarSenhaResponse,
    VerificarCodigoPayload,
    VerificarCodigoResponse,
    RedefinirSenhaPayload,
    RedefinirSenhaResponse
} from '../types/api'

const API_URL = import.meta.env.VITE_API_URL;


// =====================================================
// LOGIN
// =====================================================

// LOGIN
export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {

    const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ?? data?.erro ?? "Email ou senha inválidos"
        );
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    return data;
}


// =====================================================
// CADASTRO
// =====================================================


// CADASTRO
export async function cadastro(
    payload: CadastroPayLoad
): Promise<CadastroResponse> {

    const response = await fetch(`${API_URL}/cadastro/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ?? data?.erro ?? "Erro no cadastro"
        );
    }

    return data;
}


// REFRESH TOKEN
export async function refreshToken(): Promise<string> {

    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
        throw new Error("Refresh token não encontrado");
    }

    const response = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        logoutLocal();

        throw new Error(
            data?.detail ?? data?.erro ?? "Não foi possível renovar a sessão"
        );
    }

    localStorage.setItem("access", data.access);

    if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
    }

    return data.access;
}


// LOGOUT LOCAL
function logoutLocal() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
}


// LOGOUT
export async function logout() {

    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
        if (access && refresh) {
            await fetch(`${API_URL}/logout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                },
                body: JSON.stringify({ refresh }),
            });
        }
    } finally {
        logoutLocal();
    }
}


// RECUPERAR SENHA
export async function recuperarSenha(
    payload: RecuperarSenhaPayload
): Promise<RecuperarSenhaResponse> {

    const response = await fetch(`${API_URL}/password/solicitar/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ?? data?.erro ?? "Erro ao solicitar recuperação de senha"
        );
    }

    return data;
}


// VERIFICAR CÓDIGO
export async function verificarCodigo(
    payload: VerificarCodigoPayload
): Promise<VerificarCodigoResponse> {

    const response = await fetch(`${API_URL}/password/validar/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ?? data?.erro ?? "Código de verificação inválido"
        );
    }

    return data;
}


// REDEFINIR SENHA
export async function redefinirSenha(
    payload: RedefinirSenhaPayload
): Promise<RedefinirSenhaResponse> {

    const response = await fetch(`${API_URL}/password/redefinir/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ?? data?.erro ?? "Erro ao redefinir senha"
        );
    }

    return data;
}