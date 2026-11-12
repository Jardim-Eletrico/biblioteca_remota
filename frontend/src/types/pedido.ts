export interface PedidoPayload {
    edicao: number;
}

export interface PedidoResponse {
    id: number;
    leitor: number;
    nome_leitor: string;
    edicao: number;
    titulo: string;
    autor: string;
    status: "pendente" | "aprovado" | "recusado" | "cancelado";
    data_pedido: string;
    data_resposta: string | null;
}