
import useMeusEmprestimos from "@/src/hooks/leitor/useMeusEmprestimos";
import FiltroEmprestimos from "@/components/emprestimos/FiltroEmprestimos";
import EmprestimoCard from "@/components/emprestimos/EmprestimoCard";

export default function MeusEmprestimos() {
    const {
        pedidosFiltrados,
        filtro,
        setFiltro,
        carregando,
        cancelandoId,
        erro,
        sucesso,
        cancelar,
        podeCancelarPedido,
    } = useMeusEmprestimos();

    return (
        <div >
    <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-0.5 w-full mb-4">
            <div className="w-1 h-4.5 bg-primary rounded-[10px]" />
            <span className="font-space-grotesk text-[16px] font-semibold dark:text-white">
                Meus Empréstimos e Pedidos
            </span>
        </div>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
            Acompanhe seus pedidos e empréstimos.
        </p>

        <FiltroEmprestimos
            filtro={filtro}
            onChange={setFiltro}
        />

        {erro && (
            <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
                {erro}
            </p>
        )}

        {sucesso && (
            <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-950 dark:text-green-300">
                {sucesso}
            </p>
        )}

        {carregando ? (
            <p>Carregando seus empréstimos...</p>
        ) : pedidosFiltrados.length === 0 ? (
            <p className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-800">
                {filtro === "ativos"
                    ? "Você não possui pedidos ou empréstimos ativos."
                    : "Você ainda não possui empréstimos devolvidos."}
            </p>
        ) : (
            <div className="space-y-4">
                {pedidosFiltrados.map((pedido) => (
                    <EmprestimoCard
                        key={pedido.id}
                        pedido={pedido}
                        podeCancelar={
                            filtro === "ativos" &&
                            podeCancelarPedido(pedido)
                        }
                        cancelando={cancelandoId === pedido.id}
                        onCancelar={() => cancelar(pedido.id)}
                    />
                ))}
            </div>
        )}
    </div>
</div>
    );
}
