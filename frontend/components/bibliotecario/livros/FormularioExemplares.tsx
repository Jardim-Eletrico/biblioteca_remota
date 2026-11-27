interface FormularioExemplaresProps {
    quantidade: string;
    indice: number;
    atualizarQuantidade: (indice: number, quantidade: string) => void;
}

export default function FormularioExemplares({
    quantidade,
    indice,
    atualizarQuantidade,
}: FormularioExemplaresProps) {
    const id = `quantidade-exemplares-${indice}`;

    return (
        <div className="rounded-lg border border-gray-stroke bg-gray-50 p-4 dark:border-surface-mid dark:bg-surface-dark">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                    Exemplares desta edição
                </h3>

                <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                    Informe quantos exemplares físicos deseja cadastrar.
                    O sistema gerará um tombo individual para cada exemplar.
                </p>
            </div>

            <div>
                <label
                    htmlFor={id}
                    className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Quantidade de exemplares *
                </label>

                <input
                    id={id}
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={quantidade}
                    onChange={(e) =>
                        atualizarQuantidade(indice, e.target.value)
                    }
                    required
                    placeholder="Ex.: 5"
                    className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-surface-mid dark:bg-surface-dark dark:text-white"
                />

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    É permitido cadastrar de 1 a 100 exemplares por edição.
                </p>
            </div>
        </div>
    );
}