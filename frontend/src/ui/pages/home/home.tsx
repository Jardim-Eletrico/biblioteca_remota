import { useState, useEffect } from "react";
import { listarEdicoes } from "@/src/services/edicoesService";
import type { EdicaoResponse } from "@/src/types/edicao";
import { listarLivros } from "@/src/services/livrosService";
import type { LivroResponse } from "@/src/types/livro";
import { useNavigate } from "react-router-dom";
import { buscarPerfil } from "@/src/services/perfilService";
import LivroCard from "@/components/app/landing/livro_card";

interface LivrosComEdicoes extends LivroResponse {
    edicoes: EdicaoResponse[];
}

export default function Home() {
    const access = localStorage.getItem("access");
    const [livros, setLivros] = useState<LivrosComEdicoes[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!access) {
            navigate("/auth")
        }

        async function carregarLivros() {
        
            try {
                await buscarPerfil();

                setCarregando(true);
                setErro(null);

                const [livros, edicoes] = await Promise.all([
                    listarLivros(),
                    listarEdicoes(),
                ])

                const livrosComEdicoes: LivrosComEdicoes[] = livros.map((livro) => {
                    const edicoesLivro = edicoes.filter(
                        (edicao) => edicao.livro === livro.id
                    );

                    return {
                        ...livro,
                        edicoes: edicoesLivro
                    };
                });

                setLivros(livrosComEdicoes);

            }
            
            catch (error) {
                setErro(
                    error instanceof Error ? error.message : "Erro ao carregar os livros do acervo"
                )
            }

            finally {
                setCarregando(false);
            }

        }

        carregarLivros();
    }, [])

    return(
        <>
            {erro && console.log(erro)}
            {carregando && <p>Carregando livros</p>}

            <div className="grid grid-cols-2 w-full gap-7.5">
                {livros.map((livro) => (
                    <div key={livro.id}>
                        {livro.edicoes.map((edicao) => (
                            <LivroCard
                                key={edicao.id} 
                                autor={livro.autor} 
                                titulo={livro.titulo}
                                image={edicao.capa?? "Capa não encontrada"}
                            />
                        ))}
                        
                            
                        </div>
                ))}
            </div>
            
        </>
    )
}