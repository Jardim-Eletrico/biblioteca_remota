import labelStyle from "@/modules/auth/label.module.css";
import inputStyle from "@/modules/auth/input.module.css";

export default function Recovery() {
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
        </>
    )
}