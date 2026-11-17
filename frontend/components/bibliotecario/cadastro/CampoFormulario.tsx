
import type { InputHTMLAttributes } from "react";

interface CampoFormularioProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    label: string;
    erro?: string;
}

export default function CampoFormulario({
    label,
    erro,
    id,
    ...props
}: CampoFormularioProps) {

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="
                    text-sm font-semibold
                    font-ubuntu
                    text-black
                    dark:text-white
                "
            >
                {label}
            </label>

            <input
                id={id}
                {...props}
                className={`
                    w-full rounded-xl
                    border bg-white
                    px-4 py-4
                    font-ubuntu text-sm
                    text-black
                    placeholder:text-text-muted
                    shadow-md outline-none
                    transition-all
                    dark:bg-surface-mid
                    dark:text-white
                    dark:placeholder:text-text-light
                    focus:border-primary
                    focus:ring-2 focus:ring-primary/20
                    ${erro
                        ? "border-warning"
                        : "border-gray-stroke dark:border-surface-mid"
                    }
                `}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? `${id}-erro` : undefined}
            />

            {erro && (
                <span
                    id={`${id}-erro`}
                    className="text-sm text-warning"
                >
                    {erro}
                </span>
            )}
        </div>
    );
}
