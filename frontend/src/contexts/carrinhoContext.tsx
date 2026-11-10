
import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";

import type { ItemCarrinho } from "@/src/types/carrinho";


// =====================================================
// INTERFACE DO CONTEXTO
// =====================================================

interface CarrinhoContextProps {
    itens: ItemCarrinho[];
    quantidade: number;

    adicionarItem: (item: ItemCarrinho) => void;
    removerItem: (edicaoId: number) => void;
    limparCarrinho: () => void;
}


// =====================================================
// CRIAÇÃO DO CONTEXTO
// =====================================================

const CarrinhoContext = createContext<CarrinhoContextProps | undefined>(
    undefined
);


// =====================================================
// PROVIDER DO CARRINHO
// =====================================================

interface CarrinhoProviderProps {
    children: ReactNode;
}

export function CarrinhoProvider({
    children
}: CarrinhoProviderProps) {

    const [itens, setItens] = useState<ItemCarrinho[]>([]);


    // ADICIONAR ITEM
    function adicionarItem(item: ItemCarrinho) {

        setItens((anteriores) => {

            const jaAdicionado = anteriores.some(
                (anterior) => anterior.edicaoId === item.edicaoId
            );

            if (jaAdicionado) {
                return anteriores;
            }

            return [...anteriores, item];
        });
    }


    // REMOVER ITEM
    function removerItem(edicaoId: number) {

        setItens((anteriores) =>
            anteriores.filter(
                (item) => item.edicaoId !== edicaoId
            )
        );
    }


    // LIMPAR CARRINHO
    function limparCarrinho() {
        setItens([]);
    }


    // DISPONIBILIZAR CONTEXTO
    return (
        <CarrinhoContext.Provider
            value={{
                itens,
                quantidade: itens.length,
                adicionarItem,
                removerItem,
                limparCarrinho
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    );

}


// =====================================================
// HOOK PARA ACESSAR O CARRINHO
// =====================================================

export function useCarrinho() {

    const contexto = useContext(CarrinhoContext);

    if (!contexto) {
        throw new Error(
            "useCarrinho deve ser utilizado dentro de CarrinhoProvider"
        );
    }

    return contexto;
}
