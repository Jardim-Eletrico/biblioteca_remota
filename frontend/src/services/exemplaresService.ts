import type { ExemplarResponse, ExemplarLotePayload } from "../types/exemplar";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";


export async function listarExemplares(): Promise<ExemplarResponse[]> {
    const response = await fetch(`${API_URL}/exemplares`)
    return
    
}