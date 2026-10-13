export interface LoginResponse {
    acess: string;
    refresh : string;
}

export interface CadastroPayLoad {
    email: string;
    password: string;
    nome: string;
}

export interface CadastroResponse {
  id: number;
  email: string;
  nome: string;
}

