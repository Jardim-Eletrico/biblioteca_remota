import { useEffect, useState } from "react";

import type { ItemCarrinho } from "@/src/types/carrinho";
import { listarItensCarrinho, removerItemCarrinho } from "@/src/services/carrinhoService";
import ItemCarrinhoCard from "@/components/carrinho/carrinhoCard";
import Loader from "@/components/app/loader_animation/loader";


export default function Carrinho() {
    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function carregarCarrinho() {
            try {
                const dados = await listarItensCarrinho();
                setItens(dados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar carrinho."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarCarrinho();
    }, []);

    if (carregando) {
        return (
            <div className="flex justify-center items-center w-full">
                <Loader />
            </div>
        )
    }

    if (erro) {
        return <p>Erro: {erro}</p>;
    }

    async function removerItem(itemId: number) {
        try {
            await removerItemCarrinho(itemId);

            const dados = await listarItensCarrinho();
            setItens(dados);

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao remover item do carrinho."
            );
        }
    }

    return (
        <div className="flex flex-col items-center w-full gap-5">
            <div className="flex items-center gap-0.5 w-full">
                <div className="w-1 h-4.5 bg-primary rounded-[10px]" />
                <span className="font-space-grotesk text-[16px] font-semibold dark:text-white">Carrinho de livros</span>
            </div>
            
            <div className="
                grid grid-cols-1 gap-5
                md:grid-cols-2 w-full relative
            ">
                {itens.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    
                    itens.map((item) => (
                        <article key={item.id} className="w-full">
                            <ItemCarrinhoCard item={item} onRemover={() => removerItem(item.id)} />
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
