import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    buscarPerfil,
    atualizarPerfil
} from "@/src/services/perfilService";

import type { PerfilResponse } from "@/src/types/perfil";

export default function Perfil() {
    const [usuario, setUsuario] = useState<PerfilResponse | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erroEdicao, setErroEdicao] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const dados = await buscarPerfil();

                setUsuario(dados);
                setNome(dados.nome);
                setEmail(dados.email);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar o perfil."
                );

                navigate("/error");
            } finally {
                setCarregando(false);
            }
        }

        carregarPerfil();
    }, []);

    async function salvarAlteracoes() {
        try {
            setSalvando(true);
            setErroEdicao("");
            setSucesso("");

            const dadosAtualizados = await atualizarPerfil({
                nome,
                email,
            });

            setUsuario(dadosAtualizados);
            setNome(dadosAtualizados.nome);
            setEmail(dadosAtualizados.email);

            setEditando(false);
            setSucesso("Perfil atualizado com sucesso!");
        } catch (error) {
            setErroEdicao(
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar o perfil."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-gray-700 dark:text-white">
                    Carregando perfil...
                </p>
            </main>
        );
    }

    if (erro || !usuario) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    {erro || "Perfil não encontrado."}
                </p>
            </main>
        );
    }

    const tipoUsuario = usuario.perfis
        .map(
            perfil =>
                perfil.charAt(0).toUpperCase() + perfil.slice(1)
        )
        .join(", ");

    return (
        <main className="min-h-screen px-5 py-10">

            <div className="max-w-4xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-8">

                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Meu perfil
                    </h1>

                    {!editando && (
                        <button
                            type="button"
                            onClick={() => {
                                setNome(usuario.nome);
                                setEmail(usuario.email);
                                setErroEdicao("");
                                setSucesso("");
                                setEditando(true);
                            }}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Editar perfil
                        </button>
                    )}

                </div>

                <section className="p-6 sm:p-8">

                    {/* Identificação do usuário */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">

                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-300 dark:bg-neutral-700">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                fill="currentColor"
                                className="text-black dark:text-white"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                            </svg>

                        </div>

                        <div className="text-center sm:text-left">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {usuario.nome}
                            </h2>

                            <p className="text-gray-500 dark:text-gray-400">
                                {tipoUsuario}
                            </p>

                        </div>

                    </div>

                    <hr className="border-gray-200 dark:border-neutral-700 mb-7" />

                    {/* Informações pessoais */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                        Informações pessoais
                    </h3>

                    {editando ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Nome completo
                                </label>

                                <input
                                    type="text"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    E-mail
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="sm:col-span-2 flex flex-wrap gap-3">

                                <button
                                    type="button"
                                    onClick={salvarAlteracoes}
                                    disabled={
                                        salvando ||
                                        !nome.trim() ||
                                        !email.trim()
                                    }
                                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {salvando
                                        ? "Salvando..."
                                        : "Salvar alterações"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setNome(usuario.nome);
                                        setEmail(usuario.email);
                                        setErroEdicao("");
                                        setEditando(false);
                                    }}
                                    disabled={salvando}
                                    className="px-5 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Cancelar
                                </button>

                            </div>

                            {erroEdicao && (
                                <p className="sm:col-span-2 text-red-500 text-sm">
                                    {erroEdicao}
                                </p>
                            )}

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Nome completo
                                </p>

                                <p className="text-gray-900 dark:text-white">
                                    {usuario.nome}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    E-mail
                                </p>

                                <p className="text-gray-900 dark:text-white">
                                    {usuario.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Tipo de conta
                                </p>

                                <p className="text-gray-900 dark:text-white">
                                    {tipoUsuario}
                                </p>
                            </div>

                        </div>
                    )}

                    {/* Mensagens */}
                    {sucesso && (
                        <p className="mt-4 text-green-600 dark:text-green-400 text-sm">
                            {sucesso}
                        </p>
                    )}

                </section>

            </div>

        </main>
    );
}
