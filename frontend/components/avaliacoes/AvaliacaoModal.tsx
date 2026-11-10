import { use, useState } from "react";

import AvaliacaoEstrelas from "./AvaliacaoEstrelas";
import { avaliarLivro } from "@/src/services/avaliacaoService";

interface AvaliacaoModalProps {
    livroId: number;
    titulo: string;
    capa: string | null;
    onFechar: () => void;
    onAvaliacaoEnviada?: () => void;
}

export default function AvaliacaoModal({
    livroId,
    titulo,
    capa,
    onFechar,
    onAvaliacaoEnviada

}:AvaliacaoModalProps) {

    const [nota, setNota] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    async function enviarAvaliacao() {

        if (nota === 0){
            setErro("Selecione uma nota para continuar");
            return;
        }
        try{
            setEnviando(true);
            setErro(null);

            await avaliarLivro(livroId, {nota});

            setSucesso(true);
            onAvaliacaoEnviada?.();
        }catch (error) {
            setErro(
                error instanceof Error
                ? error.message
                : "Não foi possível registrar a sua avaliação"
            );
        } finally {
            setEnviando(false);
        }
        
    }

    return(
        <div className="
            fixed inset-0 z-40
            flex items-center justify-center
            bg-black/40 dark:bg-black/60
            backdrop-blur-md
            px-5 py-6
            ">

                <section
                    role="dialog"
                    aria-model="true"
                    aria-labelledby="titulo-avaliacao"

                    className="
                        relative w-full max-w-md
                        rounded-3xl
                        bg-white
                        p-6 shadow-xl
                        dark:bg-surface-dark
                        "
                    >

                        <button
                            type="button"
                            onClick={onFechar}
                            aria-label="Fechar avaliação"
                            className="
                            absolute right-5 top-4
                            text-2xl text-text-muted
                            transition-colors
                            hover:text-warning
                            dark:text-text-light
                            ">
                                x
                        </button>

                        <div className="flex flex-col items-center">
                            <h2
                                id="titulo-avaliacao"
                                className="
                                    mt-5 text-xl font-bold font-space-grotesk
                                    tracking-wide
                                    text-center text-black
                                    dark:text-white
                                    ">
                                        Deixe sua avaliação
                            </h2>

                            <p className="
                                mt-4 text-base font-ubuntu font-semibold
                                tracking-wide
                                text-center text-black
                                dark:text-white
                                ">

                                {titulo}

                            </p>

                            <div className="
                                mt-5 flex h-56 w-40
                                items-center justify-center
                                overflow-hidden rounded-lg
                                bg-light-gray
                                dark:bg-surface-mid
                            ">

                                {capa ? (
                                    <img src={capa} alt={`Capa de ${titulo}`}
                                    className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="
                                    text-sm text-text-muted
                                    dark: text-text-light
                                    ">
                                        Capa indisponível
                                    </span>
                                ) }
                            </div>

                            <div className="mt-6">
                                <AvaliacaoEstrelas
                                    nota={nota}
                                    onChange={setNota}
                                    disabled={enviando || sucesso}
                                />
                            </div>

                            {erro && (
                                <p className="
                                mt-4 text-center text-sm
                                text-warning
                                ">
                                    {erro}
                                </p>
                            )}

                            {sucesso && (
                                <p className="
                                mt-4 text-center text-sm
                                text-vivid-green
                                ">
                                    Avaliação registrada com sucesso!
                                </p>
                            )}

                            {!sucesso ? (
                                <button
                                    type="button"
                                    onClick={enviarAvaliacao}
                                    disabled={enviando || nota === 0}
                                    className="
                                        mt-6 w-full rounded-xl
                                        bg-primary px-4 py-3
                                        font-semibold text-white
                                        transition-opacity
                                        
                                        hover:opacity-90
                                        disabled:cursor-no-allowed
                                        disabled:opacity-50
                                        
                                        focus-visible:outline-2
                                        focus-visible:outline-offset-2
                                        focus-visible:outline-primary
                                        ">
                                            {enviando
                                            ? "ENVIANDO..."
                                        : "ENVIAR AVALIAÇÃO"
                                        }
                                </button>
                            ): (
                                <button
                                    type="button"
                                    onClick={onFechar}
                                    className="
                                        mt-6 w-full rounded-xl
                                        bg-primary px-4 py-3
                                        font-semibold text-white
                                        transition-opacity
                                        hover:opacity-90
                                
                                ">

                                    FECHAR

                                </button>
                            )}

                        </div>

                </section>

        </div>
    )

}