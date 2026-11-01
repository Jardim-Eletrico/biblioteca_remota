import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";
import submitStyle from "@/modules/auth/buttons.module.css";
import requirementStyle from "@/modules/auth/password_requirements.module.css";
import { useState } from "react";

// Criando tipos para pegar propriedades e definir modos
type RecoveryStep = "email" | "code" | "redefinePassword" | "sucess";
type LoginProps = {
    setMode: (mode: "login" | "signup" | "recovery") => void;
};


//Funções principais
export default function Recovery( { setMode }: LoginProps ) {

    const [step, setStep] = useState<RecoveryStep>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(""); //Guardar o código do input para uso posterior em função

    // Verificações para nova criação de senha --> Comparação direta
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Verificações para nova criação de senha --> Atendimento aos requisitos
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    async function sendCode () { //Enviar código ao e-mail
        setStep("code");//Tira isso quando você colocar a rota pra função certa
        try {
            // Função para verificar se e-mail está no banco de dados
            const emailResponse = await fetch("http://localhost:8000/auth/recovery", {//Essa é a rota da função
                method: "POST",
                headers: { //Os dados que vai mandar
                    "Content-Type": "application/json" //vai mandar os dados em JSON
                },
                body: JSON.stringify( {email} ),
            })

            if (emailResponse.ok) {
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

    async function confirmCode(code: string) {
        setStep("redefinePassword");
        try {
            //Função para confirmar se o código está correto

            const codeResponse = await fetch("http://localhost:8000/auth/recovery/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, code })
            });

            const data = await codeResponse.json();

            if (codeResponse.ok && data.valid) {//O backend deve realizar a comparação dos códigos. Se forem iguais, deve retornar {"data": valid}
                setStep("redefinePassword");
            }

            if (!codeResponse.ok) {
                throw new Error("Falha ao confirmar o código de autenticação");
            }
        }

        catch (error) {
            console.error(error);
        }


    }

    async function confirmNewPassword() {
        setStep("sucess");
        if (password === confirmPassword) {
            try{
                const passwordResponse = await fetch("http://localhost:8000/auth/recovery", { // O backend deve alterar a senha antiga do usuário pela nova, filtrando os usuários pelo email dado
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify( { email, password } )
            
                })

                if (!passwordResponse.ok) {
                    throw new Error("Falha ao criar nova senha");
                }

                else {
                    setStep("sucess");
                }
            
            }
            catch (error) {
                console.error(error)
            }
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
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} //Vai alterar a propriedade do email pro valor que estiver no input quando mudar
                            required
                        />
                        <button className={`${submitStyle.submit_button}`} type="submit"
                            onClick={sendCode}
                        >ENVIAR CÓDIGO</button>

                    </div>
                </>

            ) : step === "code" ? (
                <>
                 <p className="font-ubuntu text-white text-[1rem] font-medium text-center">Código de verificação enviado para <span className="text-blue-link">{"exemplo@gmail.com"}</span></p>
                    <div className="flex flex-col w-full h-fit gap-1.5">
                        <label className={labelStyle.label} htmlFor="code">
                            Código de verificação
                        </label>
                        <input
                            className={inputStyle.input}
                            type="number"
                            id="code"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder=""
                            required
                        />
                        <button className={`${submitStyle.submit_button}`} type="submit"
                            onClick={() => confirmCode(code)}
                        >CONFIRMAR</button>
                        
                        <button className={`${submitStyle.resend_button}`} type="submit"
                            onClick={sendCode}
                        >REENVIAR</button>
                    </div>
                </>

            ) : step === "redefinePassword" ? (
                <>
                 <p className="font-ubuntu text-white text-[1.5rem] font-semibold text-center">Novas credidenciais</p>
                    <div className="flex flex-col w-full h-fit gap-1.5">

                        <div className="flex flex-col w-full">
                            <span className={`${requirementStyle.requirement} ${hasMinLength ? requirementStyle.valid : requirementStyle.invalid}`}>
                                Deve conter ao menos 8 caracteres
                            </span>

                            <span className={`${requirementStyle.requirement} ${hasUppercase ? requirementStyle.valid : requirementStyle.invalid}`}>
                                Deve conter ao menos uma letra maiúscula
                            </span>

                            <span className={`${requirementStyle.requirement} ${hasLowercase ? requirementStyle.valid : requirementStyle.invalid}`}>
                                Deve conter ao menos uma letra minúscula
                            </span>

                            <span className={`${requirementStyle.requirement} ${hasNumber ? requirementStyle.valid : requirementStyle.invalid}`}>
                                Deve conter ao menos um número
                            </span>
                        </div>

                        <label className={labelStyle.label} htmlFor="password">
                            Nova senha
                        </label>
                        <input
                            className={inputStyle.input}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Insira sua nova senha"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <label className={labelStyle.label} htmlFor="password">
                            Confirmar senha
                        </label>
                        <input
                            className={inputStyle.input}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Confirme sua nova senha"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button className={`${submitStyle.submit_button}`} type="submit"
                            onClick={confirmNewPassword}
                        >ENVIAR CÓDIGO</button>
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