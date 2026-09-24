import { useState } from "react";
import { login } from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const dados = await login(email, password);

            console.log(dados);
        } catch (erro) {
            console.error(erro);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2"
            >
                Entrar
            </button>
        </div>
    );
}