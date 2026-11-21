import { criarPedido } from "@/src/services/pedidoService";
import type { ItemCarrinho } from "@/src/types/carrinho";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removerItemCarrinho } from "@/src/services/carrinhoService";
import React from "react";

type PrazoEmprestimo = 1 | 2 | null;

export default function ConfirmarReserva() {

    const [prazoEmprestimo, setPrazoEmprestimo] = useState<PrazoEmprestimo>(null);
    const [sombras, setSombras] = useState<number>(0);
    
    const location = useLocation();
    const itensCarrinho: ItemCarrinho[] = location.state?.itensCarrinho || [];
        
    const navigate = useNavigate();

    const [imageError, setImageError] = useState(false);

    async function handleConfirmarReserva(prazo: PrazoEmprestimo) {
        try {
            if (prazo === null) {
                setSombras(15);

                setTimeout(() => {
                    setSombras(0);
                }, 1000);

                return;
            }

            const response = await criarPedido({
                edicoes: itensCarrinho.map(item => item.edicaoId),
                prazo: prazo
            });

            alert("Reserva solicitada com sucesso!");
            console.log(response);

            // Limpar o carrinho
            try {
                await Promise.all(
                    itensCarrinho.map(item => removerItemCarrinho(item.id))
                );
                navigate("/home");
            }

            catch (error){
                console.error(error);
            }
            
        }

        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col items-center w-full flex-1 gap-5">
            <div className="flex items-center gap-0.5 w-full">
                <div className="w-1 h-4.5 bg-primary rounded-[10px]" />
                <span className="font-space-grotesk text-[16px] font-semibold dark:text-white">Carrinho de livros</span>
            </div>
            

            <div className="grid grid-cols-1 justify-items-center w-full flex-1 gap-5">

                {itensCarrinho.map((item, index) => (

                    <React.Fragment key={item.id}>
                        <div className="flex flex-col items-center gap-5">

                            <div className="
                                w-[80%] overflow-hidden
                                 flex flex-col gap-1.5 bg-white p-3 rounded-xl dark:bg-gray-800
                            ">

                                {!imageError && item.capa ? (
                                    <div className="relative">
                                    <img
                                        src={item.capa}
                                        onError={() => setImageError(true)}
                                        alt={`Capa de ${item.titulo}`}
                                        className="h-full w-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex flex-col p-3 gap-1.5 justify-end">
                                        {item.cdd && (
                                            <span className="
                                                inline-block max-w-full
                                                truncate rounded-md
                                                bg-blue-100/80 px-2 py-1
                                                text-xs font-medium text-blue-700
                                                dark:bg-blue-900/70 dark:text-blue-100 w-fit backdrop-blur-xl
                                                
                                            ">
                                                {item.cdd}
                                            </span>
                                        )}

                                        {item.exemplaresDisponiveis > 0 ? (
                                            <span className="
                                                inline-flex items-center gap-1
                                                rounded-md bg-green-100/80
                                                px-2 py-1 text-xs font-medium
                                                text-green-700
                                                dark:bg-green-900/70 dark:text-green-100 w-fit backdrop-blur-xl
                                            ">
                                                <span className="h-2 w-2 rounded-full bg-green-600" />
                                                Disponível
                                            </span>
                                        ) : (
                                            <span className="
                                                inline-flex items-center gap-1
                                                rounded-md bg-amber-100
                                                px-2 py-1 text-xs font-medium
                                                text-amber-700
                                                dark:bg-amber-900/40 dark:text-amber-300
                                            ">
                                                <span className="h-2 w-2 rounded-full bg-amber-600" />
                                                Indisponível
                                            </span>
                                        )}
                                    </div>
                                    </div>
                                ) : (
                                    <div className="
                                        flex h-full w-full items-center justify-center
                                        border border-black dark:border-white
                                        rounded-lg
                                    ">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="50"
                                            height="50"
                                            fill="currentColor"
                                            className="bi bi-book text-black dark:text-white rounded-lg"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                                        </svg>
                                    </div>
                                )}

                                <div className="flex flex-col w-full gap-0.5">
                                    <p className="w-full font-roboto font-medium text-[16px] dark:text-white">{item.titulo}</p>
                                    <p className="w-full font-roboto font-light text-text-muted text-[14px] dark:text-gray-500">{item.editora}</p>
                                </div>

                            </div>
                            
                        </div>

                        {index < itensCarrinho.length - 1 && (
                            <div className="w-[90%] h-px bg-gray-300 dark:bg-gray-600" />
                        )}

                    </React.Fragment>

                ))}

                <div className="flex flex-col w-[80%] gap-3 bg-white dark:bg-gray-800 p-3 rounded-t-lg mt-auto">
                    <p className="font-roboto font-medium text-[14px] dark:text-white">Duração do empréstimo</p>

                    <div className="flex flex-row gap-2 items-strech">

                        <button 
                            className={`
                                flex items-center justify-center w-full h-10
                                rounded-lg font-roboto text-[14px]
                                border dark:text-white
                                transition-all duration-300 ease-in-out
                                ${prazoEmprestimo === 1
                                    ? "bg-transparent border-primary text-primary"
                                    : "bg-primary border-primary text-white"
                                }
                            `}
                            style={{
                                boxShadow: sombras > 0 ? `0 0 ${sombras}px 3px #2563EB80` : "none"
                            }}
                            onClick={() => setPrazoEmprestimo(1)}
                        >
                            1 Semana
                        </button>

                        <button 
                            className={`
                                flex items-center justify-center w-full h-10
                                rounded-lg font-roboto text-[14px]
                                border
                                transition-all duration-300 ease-in-out
                                ${prazoEmprestimo === 2
                                    ? "bg-transparent border-primary text-primary"
                                    : "bg-primary border-primary text-white"
                                }
                            `}
                            style={{
                                boxShadow: sombras > 0 ? `0 0 ${sombras}px 3px #2563EB80` : "none"
                            }}
                            onClick={() => setPrazoEmprestimo(2)}
                        >
                            2 Semanas
                        </button>
                    </div>

                    <div 
                        className="flex items-center justify-center w-full h-10 bg-primary rounded-lg font-roboto text-[14px] text-white"
                        onClick={() => handleConfirmarReserva(prazoEmprestimo)}
                    >
                        Confirmar
                    </div>
                </div>
                

            </div>
            
        </div>
    );
}