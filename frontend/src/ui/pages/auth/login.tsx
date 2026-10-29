import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";
import submitStyle from "@/modules/auth/buttons.module.css";

type LoginProps = { //É um tipo para pegar as propriedades de setMode passadas em auth.tsx -> <Login setMode={setMode}
    setMode: (mode: "login" | "signup" | "recovery") => void;
};

export default function Login( { setMode }: LoginProps ) {
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
                    autoComplete="email"
                    required
                />
            </div>

            <div className="flex flex-col w-full h-fit gap-1.5">
                <label className={labelStyle.label} htmlFor="password">
                    Senha
                </label>
                <input
                    className={inputStyle.input}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Crie uma senha"
                    autoComplete="new-password"
                    required
                />
                <button className="font-ubuntu font-normal text-[0.85rem] text-blue-link w-fit" onClick={()=> setMode("recovery")}>Esqueceu sua senha?</button>
            </div>
            <button className={`${submitStyle.submit_button}`} type="submit">ENTRAR</button>
        </>
    )
}