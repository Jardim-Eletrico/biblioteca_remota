const API_URL = "http://127.0.0.1:8000/api";

export async function login(email: string, password: string) {
    const resposta = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!resposta.ok) {
        throw new Error("Email ou senha inválidos");
    }

    return resposta.json();
}