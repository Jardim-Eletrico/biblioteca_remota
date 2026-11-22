import { useRef, useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";

export function ExcluirTodasNotificacoes({
    onExcluir
}: {
    onExcluir: () => void;
}) {
    const [posicao, setPosicao] = useState(0);
    const [arrastando, setArrastando] = useState(false);

    const inicioX = useRef(0);
    const posicaoInicial = useRef(0);
    const arrastandoRef = useRef(false);

    const LIMITE = 110;

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

        setPosicao(atual => atual < -LIMITE / 2 ? -LIMITE : 0);
    }

    return (
        <div className="flex items-center relative w-full overflow-hidden rounded-lg h-15">

            {/* BOTÃO REVELADO */}
            <button
                onClick={onExcluir}
                className="
                    absolute right-0 top-0 bottom-0
                    flex h-full w-27.5
                    items-center justify-center gap-2
                    bg-red-600 text-white
                    hover:bg-red-700 rounded-lg
                "
            >
                <Trash2 size={20} />
                Excluir
            </button>

            {/* TEXTO ARRASTÁVEL */}
            <div
                onPointerDown={iniciarArrasto}
                onPointerMove={arrastar}
                onPointerUp={finalizarArrasto}
                onPointerCancel={finalizarArrasto}
                style={{
                    transform: `translateX(${posicao}px)`,
                    transition: arrastando
                        ? "none"
                        : "transform 200ms ease"
                }}
                className="
                    relative z-10
                    flex items-center justify-between
                    w-full p-4
                    bg-gray-200 dark:bg-gray-800
                    touch-pan-y select-none
                    cursor-grab active:cursor-grabbing
                "
            >
                <span className="text-sm font-medium dark:text-white md:text-[20px]">
                    Arraste para excluir todas as notificações
                </span>

                <ArrowLeft className="dark:text-white" size={20} />
            </div>
        </div>
    );
}