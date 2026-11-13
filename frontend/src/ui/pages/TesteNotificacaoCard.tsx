
import { useEffect, useState } from "react";

import NotificacaoCard from "@/components/notificacoes/NotificacaoCard";

import {
    listarNotificacoes,
    excluirNotificacao as excluirNotificacaoService
} from "@/src/services/notificacaoService";

import type {
    NotificacaoResponse
} from "@/src/types/notificacoes";

export default function TesteNotificacaoCard() {

    const [notificacoes, setNotificacoes] = useState<NotificacaoResponse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Buscar notificações da API
    useEffect(() => {
        async function carregarNotificacoes() {
            try {
                setCarregando(true);
                setErro(null);

                const dados = await listarNotificacoes();

                setNotificacoes(dados);

            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar notificações."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarNotificacoes();
    }, []);

    // Excluir notificação
    async function excluirNotificacao(id: number) {

        const confirmar = window.confirm(
            "Deseja realmente excluir esta notificação?"
        );

        if (!confirmar) return;

        try {
            await excluirNotificacaoService(id);

            setNotificacoes((anteriores) =>
                anteriores.filter(
                    (notificacao) => notificacao.id !== id
                )
            );

        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir a notificação."
            );
        }
    }

    return (

            <div className="mx-auto max-w-5xl px-5">

                {/* Carregamento */}
                {carregando && (
                    <p className="py-10 text-center">
                        Carregando notificações...
                    </p>
                )}

                {/* Erro */}
                {erro && (
                    <p className="
                        py-10 text-center text-red-500
                    ">
                        {erro}
                    </p>
                )}

                {/* Notificações */}
                {!carregando && !erro && (
                    notificacoes.length > 0 ? (

                        <div className="
                            flex flex-col gap-4
                        ">
                            {notificacoes.map((notificacao) => (
                                <NotificacaoCard
                                    key={notificacao.id}
                                    notificacao={notificacao}
                                    onExcluir={excluirNotificacao}
                                />
                            ))}
                        </div>

                    ) : (
                        <p className="
                            py-12 text-center
                            text-zinc-500
                            dark:text-zinc-400
                        ">
                            Você não possui notificações.
                        </p>
                    )
                )}

            </div>
    );
}
