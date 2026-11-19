import { useEffect, useState } from "react";

import type { ItemCarrinho } from "@/src/types/carrinho";
import { listarItensCarrinho } from "@/src/services/carrinhoService";

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
        return <p>Carregando carrinho...</p>;
    }

    if (erro) {
        return <p>Erro: {erro}</p>;
    }

    return (
        <main>
            <h1>Meu carrinho</h1>

            <p>Quantidade de itens: {itens.length}</p>

            {itens.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                itens.map((item) => (
                    <article key={item.id}>
                        <h2>{item.titulo}</h2>
                        <p>Editora: {item.editora}</p>
                        <p>ID do livro: {item.livroId}</p>
                        <p>ID da edição: {item.edicaoId}</p>
                        <p>
                            Exemplares disponíveis: {item.exemplaresDisponiveis}
                        </p>

                        {item.capa && (
                            <img
                                src={item.capa}
                                alt={`Capa de ${item.titulo}`}
                                width={120}
                                height={120}
                            />
                        )}
                    </article>
                ))
            )}
        </main>
    );
}
