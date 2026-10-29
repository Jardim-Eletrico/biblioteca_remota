import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";
import submitStyle from "@/modules/auth/buttons.module.css";
import { useState } from "react";

// Criando tipos para pegar propriedades e definir modos
type RecoveryStep = "email" | "code";
type LoginProps = {
    setMode: (mode: "login" | "signup" | "recovery") => void;
};


//Funções principais
export default function Recovery( { setMode }: LoginProps ) {

    const [step, setStep] = useState<RecoveryStep>("email");
    const[email, setEmail] = useState("");

    async function sendCode () {
        setStep("code");
        try {
            // Função para verificar se e-mail está no banco de dados
            const emailResponse = await fetch("http://localhost:8000/auth/recovery", {//Essa é a rota da função
                method: "POST",
                headers: { //Os dados que vai mandar
                    "Content-Type": "application/json" //vai mandar os dados em JSON
                },
                body: JSON.stringify( {email} ),
            })

            if (step !== "code" && emailResponse.ok) {
                setStep("code");
            }

            if (!emailResponse.ok) {
                throw new Error("Falha ao solicitar o código");
            }
        }

        catch (error) {
            console.error(error);
        }  
    }

    return(
        <>
            {step === "email" ? (
                <>
                 <p className="font-ubuntu text-white text-[1rem] font-medium text-center">INSIRA SEU E-MAIL ABAIXO E UM CÓDIGO DE VERIFICAÇÃO SERÁ ENVIADO</p>
                    <div className="flex flex-col w-full h-fit gap-1.5">
                        <label className={labelStyle.label} htmlFor="email">
                            E-mail
                        </label>
                        <input
                            className={inputStyle.input}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Insira seu e-mail"
                            autoComplete="email"
                            onChange={(event) => setEmail(event.target.value)} //Vai alterar a propriedade do email pro valor que estiver no input quando mudar
                            required
                        />
                        <button className={`${submitStyle.submit_button}`} type="submit"
                            onClick={sendCode} //Escreva uma função lá em cima para chamar o backend para ver se existe o email no banco de dados. Se for true, ela deve mudar o stepMode para "code" e mandar um email pro usuário
                        >ENVIAR CÓDIGO</button>

                    </div>
                </>

            ) : step === "code" ? (
                <>
                 <p className="font-ubuntu text-white text-[1rem] font-medium text-center">Código de verificação enviado para <span className="text-blue-link">{"exemplo@gmail.com"}</span></p>
                    <div className="flex flex-col w-full h-fit gap-1.5">
                        <label className={labelStyle.label} htmlFor="email">
                            Código de verificação
                        </label>
                        <input
                            className={inputStyle.input}
                            type="number"
                            id="code"
                            name="code"
                            placeholder=""
                            required
                        />
                        <button className={`${submitStyle.submit_button}`} type="submit">CONFIRMAR</button>
                        
                        <button className={`${submitStyle.resend_button}`} type="submit"
                            onClick={sendCode}
                        >REENVIAR</button>
                    </div>
                </>

            ) : step === "sucess" ? (
                <>
                 <p className="font-ubuntu text-white text-[1rem] font-medium text-center">INSIRA SEU E-MAIL ABAIXO E UM CÓDIGO DE VERIFICAÇÃO SERÁ ENVIADO</p>
                    <div className="flex flex-col w-full h-fit gap-1.5">
                        <label className={labelStyle.label} htmlFor="email">
                            E-mail
                        </label>
                        <input
                            className={inputStyle.input}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Insira seu e-mail"
                            autoComplete="email"
                            required
                        />
                        <button className={`${submitStyle.submit_button}`} type="submit">ENVIAR CÓDIGO</button>
                    </div>
                </>
            ) : null}
            <div className="flex flex-row gap-0.5 justify-center">
                <span className="font-ubuntu text-[0.85rem] text-white">Mudou de ideia? Volte à</span>
                <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link w-fit" onClick={()=> setMode("login")}>página anterior</button>
            </div>
           
        </>
    )
}