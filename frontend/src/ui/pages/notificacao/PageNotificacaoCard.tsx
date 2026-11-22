import Loader from "@/components/app/loader_animation/loader";
import { useEffect, useState, useRef } from "react";

import { ExcluirTodasNotificacoes } from "@/components/notificacoes/excluirTodasNotificacoes";

import NotificacaoCard from "@/components/notificacoes/NotificacaoCard";

import {
    listarNotificacoes,
    excluirNotificacao as excluirNotificacaoService
} from "@/src/services/notificacaoService";

import type {
    NotificacaoResponse
} from "@/src/types/notificacoes";

export default function PageNotificacaoCard() {

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

    //Excluir todas as notificações
    async function excluirTodasNotificacoes() {

        try {
            await Promise.all(
                notificacoes.map(async (notificacao) => {
                    await excluirNotificacaoService(notificacao.id);
                }))

            setNotificacoes([]);
        }

        catch (error) {
            console.error(error)
        }
    }

    const [posicao, setPosicao] = useState(0);
    const [arrastando, setArrastando] = useState(false);

    const inicioX = useRef(0);
    const posicaoInicial = useRef(0);
    const arrastandoRef = useRef(false);

    const LIMITE = 90;

    function iniciarArrasto(e: React.PointerEvent<HTMLDivElement>) {
        inicioX.current = e.clientX;
        posicaoInicial.current = posicao;
        arrastandoRef.current = true;
        setArrastando(true);

        e.currentTarget.setPointerCapture(e.pointerId);
    }

    function arrastar(e: React.PointerEvent<HTMLDivElement>) {
        if (!arrastandoRef.current) return;

        const deslocamento = e.clientX - inicioX.current;

        setPosicao(
            Math.max(
                -LIMITE,
                Math.min(0, posicaoInicial.current + deslocamento)
            )
        );
    }

    function finalizarArrasto() {
        if (!arrastandoRef.current) return;

        arrastandoRef.current = false;
        setArrastando(false);

        setPosicao(atual => atual <= -LIMITE / 2 ? -LIMITE : 0);
    }

    return (

            <div className="w-full max-w-5xl px-5">

                {/* Carregamento */}
                {carregando && (
                    <div className="absolute inset-0 flex items-center justify-center scale-150">
                        <Loader />
                    </div>
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
                            <ExcluirTodasNotificacoes onExcluir={excluirTodasNotificacoes}/>

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
