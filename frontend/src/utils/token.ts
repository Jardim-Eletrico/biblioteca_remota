import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    exp: number;
}

export function tokenExpirado(token: string): boolean {
    try {
        const payload = jwtDecode<TokenPayload>(token);

        return payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}