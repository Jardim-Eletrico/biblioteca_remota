import cardStyles from "@/modules/auth/card.module.css";
import SectionTitle from "@/components/pub/auth/title"
import Logo from "@/components/pub/logo"
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import Recovery from "./recovery";


type AuthMode = "login" | "signup" | "recovery";
type RecoveryStep = "email" | "code" | "redefinePassword" | "sucess";


export default function Auth() {
    const[mode, setMode] = useState<AuthMode>("login");
    const [step, setStep] = useState<RecoveryStep>("email");

    return(
        <>
            <div className="fixed inset-0 bg-[url('/auth/auth-bg.png')] bg-center bg-no-repeat bg-cover -z-10" />

            <div className="flex flex-col items-center w-full gap-6.5 px-5 py-7.5 grow">
                <Logo aligned="vertical" text="yes" />

                {mode === "login" ? (
                    <>
                        <SectionTitle content="QUE BOM TER VOCÊ DE VOLTA" />
                    </>
                ) : mode === "signup" ? (
                    <>
                        <SectionTitle content="DÊ INÍCIO À SUA JORNADA LITERÁRIA"/>
                    </>
                ) : mode === "recovery" ? (
                    <>
                        {step !== "sucess" ? (
                            <SectionTitle content="RECUPERAÇÃO DE SENHA" />
                        ) : (
                            <>
                                <div className="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" fill="currentColor" className="bi bi-check-circle-fill text-dark-state-blue" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                    </svg>

                                    <h2 className="font-space-grotesk font-bold text-[2rem] text-white text-center">
                                        Sucesso!
                                    </h2>
                                </div>
                            </>
                        )}
                        
                        
                        
                        
                    </>
                ) : null}

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
                                <Signup setMode={setMode} />
                            </>
                        ) : (
                            <>
                                <Recovery step={step} setStep={setStep} setMode={setMode}/>
                            </>
                        )}

                        {mode === "login" ? (
                            <div className="flex flex-row justify-center gap-1">
                                <p className="font-ubuntu font-normal text-[0.85rem] text-white">Não possui uma conta?</p>
                                <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link" onClick={() => setMode("signup")}>Cadastre-se</button>
                            </div>
                        ) : mode === "signup" ? (
                            <div className="flex flex-row justify-center gap-1">
                                <p className="font-ubuntu font-normal text-[0.85rem] text-white">Já possui uma conta?</p>
                                <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link" onClick={() => setMode("login")}>Entrar</button>
                            </div>
                        ) : null
                        }

                    </form>
                </div> 
            </div> 
        
        </>
    )
}