import type { LeitorResponse } from "@/src/types/leitor";

interface LeitoresTabelaProps {
    leitores: LeitorResponse[];
    onDetalhes: (leitor: LeitorResponse) => void;
}

export default function LeitoresTabela({
    leitores,
    onDetalhes,
}: LeitoresTabelaProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-stroke bg-white shadow-sm dark:border-surface-mid dark:bg-surface-dark">
            <table className="w-full min-w-[700px] text-left">
                <thead className="bg-gray-background dark:bg-surface-mid">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-text-muted dark:text-text-light">
                        <th className="px-5 py-4">Leitor</th>
                        <th className="px-5 py-4">E-mail</th>
                        <th className="px-5 py-4 text-center">
                            Empréstimos ativos
                        </th>
                        <th className="px-5 py-4 text-center">Situação</th>
                        <th className="px-5 py-4 text-center">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-stroke dark:divide-surface-mid">
                    {leitores.map((leitor) => {
                        const quantidadeEmprestimos =
                            leitor.emprestimos.length;

                        const possuiAtraso = leitor.emprestimos.some(
                            (emprestimo) => emprestimo.atrasado
                        );

                        return (
                            <tr
                                key={leitor.id}
                                className="transition-colors hover:bg-gray-background/70 dark:hover:bg-surface-mid/50"
                            >
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="font-semibold text-dark-blue dark:text-white">
                                            {leitor.nome}
                                        </p>

                                        <p className="mt-1 text-xs text-text-muted dark:text-text-light">
                                            Leitor #{leitor.id}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-5 py-4 text-sm text-text-muted dark:text-text-light">
                                    {leitor.email}
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <span className="font-semibold text-dark-blue dark:text-white">
                                        {quantidadeEmprestimos}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                            possuiAtraso
                                                ? "bg-pale-red text-unavaiable-red dark:bg-unavaiable-red/15"
                                                : "bg-pale-green text-vivid-green dark:bg-vivid-green/15"
                                        }`}
                                    >
                                        {possuiAtraso ? "Atrasado" : "Em dia"}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onDetalhes(leitor)}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-pale-blue dark:hover:bg-dark-state-blue/20"
                                    >
                                        Ver detalhes
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}