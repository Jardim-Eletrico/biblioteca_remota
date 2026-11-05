
import { useState } from "react";

import labelStyle from "@/modules/public/auth/label.module.css";
import inputStyle from "@/modules/public/auth/input.module.css";
import submitStyle from "@/modules/public/auth/buttons.module.css";

import { cadastro } from "@/src/services/authService";
import type { CadastroPayLoad } from "@/src/types/api";

type SignupProps = {
    setMode: (mode: "login" | "signup" | "recovery") => void;
};

export default function Signup({ setMode }: SignupProps) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleCadastro() {
        if (password !== confirmPassword) {
            console.error("As senhas não coincidem");
            return;
        }

        try {
            const payload: CadastroPayLoad = {
                nome,
                email,
                password,
            };

            await cadastro(payload);

            console.log("Cadastro realizado com sucesso!");
            setMode("login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="flex flex-col w-full h-fit gap-2">
                <label className={labelStyle.label} htmlFor="name">
                    Nome
                </label>
                <input
                    className={inputStyle.input}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Insira seu nome completo"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col w-full h-fit gap-1.5">
                <label className={labelStyle.label} htmlFor="email">
                    E-mail
                </label>
                <input
                    className={inputStyle.input}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Insira seu e-mail"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col w-full h-fit gap-1.5">
                <label className={labelStyle.label} htmlFor="password">
                    Senha
                </label>
                <input
                    className={inputStyle.input}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Crie uma senha"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col w-full h-fit gap-1.5">
                <label className={labelStyle.label} htmlFor="confirmPassword">
                    Confirmar senha
                </label>
                <input
                    className={inputStyle.input}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>

            <button
                className={submitStyle.submit_button}
                type="button"
                onClick={handleCadastro}
            >
                CADASTRAR
            </button>
        </>
    );
}