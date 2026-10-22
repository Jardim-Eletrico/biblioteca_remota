import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";

export default function Signup() {
    return(
        <>
            <div className="flex flex-col w-full h-fit gap-0.5">
                <label className={labelStyle.label} htmlFor="name">
                    Nome
                </label>
                <input
                    className={inputStyle.input}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Insira seu nome completo"
                    autoComplete="name"
                    required
                />
            </div>

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
            </div>

            <div className="flex flex-col w-full h-fit gap-0.5">
                <label className={labelStyle.label} htmlFor="confirmPassword">
                    Confirmar senha
                </label>
                <input
                    className={inputStyle.input}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    required
                />
            </div>
        </>
    )
}