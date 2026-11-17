

export interface LoginResponse {
    acess: string;
    refresh : string;
}

export interface CadastroBibliotecarioPayload{
    nome: string;
    email: string;
    password: string;
}

export interface CadastroBibliotecarioResponse{
    id: number;
    nome: string;
    email: string;
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

// SOLICITAR RECUPERAÇÃO
export interface RecuperarSenhaPayload {
    email: string;
}

export interface RecuperarSenhaResponse {
    mensagem: string;
}


// VALIDAR CÓDIGO
export interface VerificarCodigoPayload {
    email: string;
    codigo: string;
}

export interface VerificarCodigoResponse {
    mensagem: string;
}


// REDEFINIR SENHA
export interface RedefinirSenhaPayload {
    email: string;
    codigo: string;
    nova_senha: string;
}

export interface RedefinirSenhaResponse {
    mensagem: string;
}
