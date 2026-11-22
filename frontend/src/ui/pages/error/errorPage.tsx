import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ErrorPage() {
    const navigate = useNavigate();
    const [redirected, setRedirected] = useState(false);

    setTimeout(() => {
        setRedirected(true);
        navigate("/home");
    }, 5000);

    return(
        <div className="flex flex-col items-center flex-1">

            <div className="flex flex-col w-full h-full flex-1 items-center justify-center gap-2 md:gap-5 lg:gap-6.5">
                <div className="flex w-full items-center">
                    <img src="/error/404character.png" alt="404 character img" className="size-36 md:size-47" />
                    <h2 className="font-ubuntu font-bold text-6xl md:text-7xl lg:text-8xl dark:text-white">OOPS!</h2>
                </div>

                <div className="flex flex-col items-center w-full gap-7 md:gap-9 lg:gap-11">
                    <h3 className="font-ubuntu font-medium text-[18px] md:text-2xl lg:text-3xl dark:text-white">Calma, é apenas uma página de erro 404</h3>
                    <p className="font-ubuntu font-medium text-[14px] md:text-[20px] lg:text-2xl text-text-muted text-center">Já vamos virar sua página de volta para a tela inicial.</p>
                </div>
            </div>

                <div className={`flex flex-col items-center w-full mt-12 md:mt-15 lg:mt-17 opacity-0 transition-all duration-500 ease-in-out ${redirected && "opacity-100"}`}>
                    <p className="font-ubuntu font-medium text-[14px] md:text-[20px] lg:text-2xl dark:text-white text-center">Parece que você não foi redirecionado. Clique abaixo para voltar à tela inicial.</p>
                    <button 
                        className="font-ubuntu font-medium text-[20px] md:text-2xl lg:text-3xl text-white bg-primary p-3 md:p-5 lg:p-6 text-center"
                        onClick={() => navigate("/home")}
                    >
                        VOLTAR À TELA INICIAL
                    </button>
                </div>
        </div>
    )
}