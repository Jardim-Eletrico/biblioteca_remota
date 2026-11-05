import { Link } from "react-router-dom";
import { useState } from "react";



interface MenuHamburguerProps {
    tipoUsuario: "leitor" | "bibliotecario";
}

export default function MenuHamburguer({ tipoUsuario }:MenuHamburguerProps){
    const [menuAberto, setMenuAberto] = useState(false);

    function alternarMenu(){
        setMenuAberto((estadoAtual) => !estadoAtual);
    }

    const itensLeitor = [
        { texto: "INÍCIO", icone: "/SVGs/house.svg", rota: "/home"},
    ];

    const itensBibliotecario = [
        { texto: "INÍCIO", icone: "/SVGs/house.svg", rota: "/home"},
    ];

    const itensMenu = tipoUsuario === "leitor" ? itensLeitor : itensBibliotecario;
    return(
        <div className="relative">
            <button
            onClick={alternarMenu}
            aria-label={menuAberto ? "Fechar Menu" : "Abrir Menu"}
            aria-expanded={menuAberto}
            className="p-2 rounded-md">

            <svg
                width="30"
                height="30"
                viewBox="0 0 21 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${
                    menuAberto ? "rotate-90" : "rotate-0"
                }`}
            >
                <path
                    d="M0 15.9375C0 15.6889 0.0987722 15.4504 0.274588 0.274588C0.450403 0.0987722 0.68886 0 0.9375 0L19.6875 0C19.9361 0 20.1746 0.0987722 20.3504 0.274588C20.5262 0.450403 20.625 0.68886 20.625 0.9375C20.625 1.18614 20.5262 1.4246 20.3504 1.60041C20.1746 1.77623 19.9361 1.875 19.6875 1.875H0.9375C0.68886 1.875 0.450403 1.77623 0.274588 1.60041C0.0987722 1.4246 0 1.18614 0 0.9375Z"
                    fill="black"
                />
            </svg>
            </button>

            {menuAberto && (
                <aside className="
                absolute left-0 top-full mt-3
                w-screen
                bg-white/70
                backdrop-blur-3xl
                pb-10
                z-50">
                    <nav className="flex flex-col gap-[25px] p-6">

                        {itensMenu.map((item) =>(
                            <a
                            key={item.rota}
                            href={item.rota}
                            onClick={() => setMenuAberto(false)}
                            className="flex items-center gap-[10px]">
                                <img src={item.icone} alt="" className="w-[25px] h-[25px]"/>
                                <span>{item.texto}</span>
                            </a>
                        ))}
                    </nav>
                </aside>
            )}
        </div>
    )
}