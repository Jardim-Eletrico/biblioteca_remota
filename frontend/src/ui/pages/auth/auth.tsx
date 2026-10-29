import cardStyles from "@/modules/auth/card.module.css";
import SectionTitle from "@/components/pub/auth/title"
import Logo from "@/components/pub/logo"
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import Recovery from "./recovery";

type AuthMode = "login" | "signup" | "recovery";

export default function Auth() {
    const[mode, setMode] = useState<AuthMode>("login");

    return(
        <>
            <div className="fixed inset-0 bg-[url('/auth/auth-bg.png')] bg-center bg-no-repeat bg-cover -z-10" />

            <div className="flex flex-col items-center w-full gap-6.5 px-5 py-2.5 grow">
                <Logo aligned="vertical" text="yes" />

                {mode === "login" ? (
                    <>
                        <SectionTitle content="QUE BOM TER VOCÊ DE VOLTA" />
                    </>
                ) : mode === "signup" ? (
                    <>
                        <SectionTitle content="DÊ INÍCIO À SUA JORNADA LITERÁRIA"/>
                    </>
                ) : (
                    <>
                        <SectionTitle content="RECUPERAÇÃO DE SENHA" />
                    </>
                )}

                <div className={cardStyles.card}>
                    <form className="flex flex-col w-full gap-4" action=""
                        onSubmit={(event) => {
                            event.preventDefault();

                            const formData = new FormData(event.currentTarget);
                            const email = formData.get("email");

                            console.log(email);
                        }}
                    >
                        {mode === "login" ? (
                            <>
                                <Login setMode={setMode} /> {/*Passa propriedades do setMode criado no início da função*/}
                            </>
                        ) : mode === "signup" ? (
                            <>
                                <Signup />
                            </>
                        ) : (
                            <>
                                <Recovery setMode={setMode}/>
                            </>
                        )}
                        <div className="flex flex-row justify-center gap-1">
                            {mode === "login" ? (
                                <>
                                    <p className="font-ubuntu font-normal text-[0.85rem] text-white">Não possui uma conta?</p>
                                    <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link" onClick={() => setMode("signup")}>Cadastre-se</button>
                                </>
                            ) : mode === "signup" ? (
                                <>
                                    <p className="font-ubuntu font-normal text-[0.85rem] text-white">Já possui uma conta?</p>
                                    <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link" onClick={() => setMode("login")}>Entrar</button>
                                </>
                            ) : null
                            }
                        </div>
                    </form>
                </div> 
            </div> 
        
        </>
    )
}