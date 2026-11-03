import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";
import submitStyle from "@/modules/auth/buttons.module.css";
import requirementStyle from "@/modules/auth/password_requirements.module.css";
import { useState } from "react";

// Criando tipos para pegar propriedades e definir modos

type RecoveryProps = {
    step: "email" | "code" | "redefinePassword" | "sucess";
    setStep: (mode: "email" | "code" | "redefinePassword" | "sucess") => void;

    setMode: (mode: "login" | "signup" | "recovery") => void;
}



//Funções principais
export default function Recovery( { step, setStep, setMode }: RecoveryProps ) {

    const [email, setEmail] = useState("");
    const [code, setCode] = useState(""); //Guardar o código do input para uso posterior em função

    // Verificações para nova criação de senha --> Comparação direta
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                    <div className="flex flex-col w-full h-fit gap-4">

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

                        <div className="flex flex-col w-full h-fit gap-1.5">
                            <label className={labelStyle.label} htmlFor="password">
                                Nova senha
                            </label>
                            <div className="relative">
                                <input
                                    className={inputStyle.input}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Insira sua nova senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />

                                <button className="absolute top-1/2 right-1.5 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 
                                    (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                    </svg>) : 
                                    (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>)}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col w-full h-fit gap-1.5">
                            <label className={labelStyle.label} htmlFor="password">
                                Confirmar senha
                            </label>
                            <div className="relative">
                                <input
                                    className={inputStyle.input}
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Confirme a nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />

                                <button className="absolute top-1/2 right-1.5 -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? 
                                    (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                    </svg>) : 
                                    (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>)}
                                </button>
                            </div>
                        </div>

                        <button className={`${submitStyle.submit_button}`} type="submit"
                            onClick={confirmNewPassword}
                        >CONFIRMAR</button>
                    </div>
                </>
            ) : step === "sucess" ? (
                <>
                <p className="text-white text-center font-semibold">
                    Sua senha foi alterada com sucesso. Clique em continuar para fazer login.
                </p>
                <button className={`${submitStyle.submit_button}`} type="submit">CONTINUAR</button>
                </>
            ) : null}
            <div className="flex flex-row gap-0.5 justify-center">
                <span className="font-ubuntu text-[0.85rem] text-white">Mudou de ideia? Volte à</span>
                <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link w-fit" onClick={()=> {setMode("login"); setStep("email")}}>página anterior</button>
            </div>
           
        </>
    )
}