
import { useState } from "react";

import type { CadastroBibliotecarioPayload } from "@/src/types/api";
import { cadastrarBibliotecario } from "@/src/services/authService";

import CampoFormulario from "./CampoFormulario";

export default function CadastroBibliotecarioForm() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    async function enviarCadastro(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setErro(null);
        setSucesso(false);

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            setEnviando(true);

            const payload: CadastroBibliotecarioPayload = {
                nome: nome.trim(),
                email: email.trim(),
                password: senha,
            };

            await cadastrarBibliotecario(payload);

            setSucesso(true);

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível cadastrar o bibliotecário."
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form
            onSubmit={enviarCadastro}
            className="flex flex-col gap-6"
        >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <CampoFormulario
                    id="nome"
                    label="Nome completo"
                    placeholder="Nome completo"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="name"
                    required
                />

                <CampoFormulario
                    id="email"
                    label="E-mail"
                    placeholder="E-mail institucional"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                <CampoFormulario
                    id="senha"
                    label="Senha"
                    placeholder="Digite uma senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="new-password"
                    required
                />

                <CampoFormulario
                    id="confirmar-senha"
                    label="Confirmar senha"
                    placeholder="Digite a senha novamente"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    autoComplete="new-password"
                    required
                />

            </div>

            {erro && (
                <div
                    role="alert"
                    className="
                        rounded-xl
                        border border-warning/30
                        bg-pale-red
                        px-4 py-3
                        text-sm text-warning
                        dark:bg-surface-mid
                    "
                >
                    {erro}
                </div>
            )}

            {sucesso && (
                <div
                    role="status"
                    className="
                        rounded-xl
                        border border-avaiable-green/30
                        bg-pale-green
                        px-4 py-3
                        text-sm text-vivid-green
                        dark:bg-surface-mid
                    "
                >
                    Bibliotecário cadastrado com sucesso!
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={enviando}
                    className="
                        w-full rounded-xl
                        bg-primary
                        px-6 py-4
                        font-ubuntu font-semibold
                        tracking-wide text-white
                        shadow-md
                        transition-all

                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-primary

                        md:w-auto md:min-w-64
                    "
                >
                    {enviando
                        ? "CADASTRANDO..."
                        : "CADASTRAR BIBLIOTECÁRIO"
                    }
                </button>
            </div>

        </form>
    );
}
    