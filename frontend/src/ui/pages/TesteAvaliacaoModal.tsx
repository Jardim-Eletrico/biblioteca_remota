
import { useState } from "react";

import AvaliacaoModal from "@/components/avaliacoes/AvaliacaoModal";

export default function TesteAvaliacaoModal() {

    const [modalAberto, setModalAberto] = useState(false);

    return (
        <main className="
            mx-auto w-full max-w-5xl
            py-8
        ">

            <h1 className="
                text-2xl font-bold
                text-dark-blue
                dark:text-light-blue-logo
            ">
                Teste de avaliação
            </h1>

            <p className="
                mt-2 text-text-muted
                dark:text-text-light
            ">
                Página temporária para testar o modal de avaliação.
            </p>

            <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="
                    mt-6 rounded-xl
                    bg-primary
                    py-3
                    font-semibold
                    text-light-blue-logo
                    hover:opacity-90
                    transition-opacity
                "
            >
                ABRIR AVALIAÇÃO
            </button>

            {modalAberto && (
                <AvaliacaoModal
                    livroId={5}
                    titulo="Jovem Urgente"
                    capa="http://127.0.0.1:8000/media/capas/JOVEMURGENTECAPA.png"
                    onFechar={() => setModalAberto(false)}
                />
            )}

        </main>
    );
}
