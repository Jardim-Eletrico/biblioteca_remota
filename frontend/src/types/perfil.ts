export interface PerfilResponse {
    id: number;
    nome: string;
    email: string;
    perfis: string[];
    leitor_id: number | null;
    bibliotecario_id: number | null
}