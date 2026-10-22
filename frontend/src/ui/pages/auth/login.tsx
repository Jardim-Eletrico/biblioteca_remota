import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";

let [setMode] = "";
export default function Login() {
    return(
        <>
            <div className="flex flex-col w-full h-fit gap-0.5">
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

            <div className="flex flex-col w-full h-fit gap-0.5">
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
                <button className="font-ubuntu font-normal text-[0.85rem] text-[#8EAABE] w-fit" onClick={()=> setMode("recovery")}>Esqueceu sua senha?</button>
            </div>
        </>
    )
}