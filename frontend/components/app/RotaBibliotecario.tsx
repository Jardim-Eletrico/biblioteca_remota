
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { buscarPerfil } from "@/src/services/perfilService";

export default function RotaBibliotecario() {
    const [autorizado, setAutorizado] = useState<boolean | null>(null);

    useEffect(() => {
        async function verificarPerfil() {
            try {
                const perfil = await buscarPerfil();

                setAutorizado(perfil.bibliotecario_id !== null);
            } catch (error) {
                console.error("Erro ao verificar perfil:", error);
                setAutorizado(false);
            }
        }

        verificarPerfil();
    }, []);

    if (autorizado === null) {
        return <p>Verificando permissões...</p>;
    }

    if (!autorizado) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
