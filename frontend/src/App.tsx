import { useState } from "react";
import { login, cadastro } from "./services/authService";

export default function App() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");

    async function handleLogin() {
        try {
            const data = await login(username, password);
            console.log("Login realizado:", data);
        } catch (error) {
            console.error("Erro no login:", error);
        }
    }

    async function handleCadastro() {
        try {
            const data = await cadastro(
                username,
                email,
                password,
                nome,
                cpf
            );

            console.log("Cadastro realizado:", data);
        } catch (error) {
            console.error("Erro no cadastro:", error);
        }
    }

    return (
        <div>
            <h2>Cadastro</h2>

            <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

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

            <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />

            <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
            />

            <button onClick={handleCadastro}>
                Cadastrar
            </button>

            <hr />

            <h2>Login</h2>

            <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Entrar
            </button>
        </div>
    );
}