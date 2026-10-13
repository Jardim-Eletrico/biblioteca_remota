const API_URL = "http://127.0.0.1:8000/api";

export async function login(
    username: string,
    password: string
) {
    const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Usuário ou senha inválidos"
        );
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    return data;
}


export async function cadastro(
    username: string,
    email: string,
    password: string,
    nome: string,
    cpf: string,
) {
    const response = await fetch(`${API_URL}/cadastro/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
            nome,
            cpf,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Erro no cadastro"
        );
    }

    return data;
}