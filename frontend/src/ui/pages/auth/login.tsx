import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";
import submitStyle from "@/modules/auth/buttons.module.css";
import { useState } from "react";

type LoginProps = { //É um tipo para pegar as propriedades de setMode passadas em auth.tsx -> <Login setMode={setMode}
    setMode: (mode: "login" | "signup" | "recovery") => void;
};

export default function Login( { setMode }: LoginProps ) {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
        try {
            const response = await fetch("http://localhost:8000/auth/login", { //Trocar pela rota funcional do backend depois
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Erro ao fazer login");
            }

            const data = await response.json();
            console.log("Login bem-sucedido:", data);
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    }

    return(
        <>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
            </div>

            <div className="flex flex-col w-full h-fit gap-1.5">
                <label className={labelStyle.label} htmlFor="password">
                    Senha
                </label>
                <div className="relative">
                    <input
                        className={inputStyle.input}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Insira sua senha"
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

                <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link w-fit" onClick={()=> setMode("recovery")}>Esqueceu sua senha?</button>
            </div>
            <button className={`${submitStyle.submit_button}`} type="submit"
                onClick={handleLogin}
            >
                ENTRAR
            </button>
        </>
    )
}