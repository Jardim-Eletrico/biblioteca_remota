
interface ModalCancelarPedidoProps {
    aberto: boolean;
    carregando: boolean;
    onConfirmar: () => void;
    onFechar: () => void;
}

export default function ModalCancelarPedido({
    aberto,
    carregando,
    onConfirmar,
    onFechar,
}: ModalCancelarPedidoProps) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Cancelar pedido
                </h2>

                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Tem certeza de que deseja cancelar este pedido?
                    Essa ação não poderá ser desfeita.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onFechar}
                        disabled={carregando}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Voltar
                    </button>

                    <button
                        type="button"
                        onClick={onConfirmar}
                        disabled={carregando}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {carregando
                            ? "Cancelando..."
                            : "Confirmar cancelamento"}
                    </button>
                </div>
            </div>
        </div>
    );
}
