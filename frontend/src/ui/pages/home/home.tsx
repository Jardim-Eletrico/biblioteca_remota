import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { listarLivros } from "@/src/services/livrosService";
import type { LivroComEdicoes } from "@/src/types/livro";
import { buscarPerfil } from "@/src/services/perfilService";
import LivroCard from "@/components/app/landing/livro_card";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/app/loader_animation/loader";
import { tokenExpirado } from "@/src/utils/token";


export default function Home() {
    const carregamentoInicial = useRef(false);
    const carregandoMais = useRef(false);

    const acess = localStorage.getItem("access");
    const [livros, setLivros] = useState<LivroComEdicoes[]>([]);
    const [temMaisLivros, setTemMaisLivros] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (carregamentoInicial.current) {
            return;
        }
        carregamentoInicial.current = true;

        async function carregarLivros() {
            try {

                if (!acess || tokenExpirado(acess)) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    navigate("/auth");
                    return;
                }

                await buscarPerfil();

                const resposta = await listarLivros(0);
                console.log("Resposta da API:", resposta);
                console.log("Resultados:", resposta.results);

                setLivros(resposta.results);
                setTemMaisLivros(resposta.next !== null);
            } catch (error) {
                console.error(error);
            } 
        }

        carregarLivros();
    }, []);

    async function carregarMaisLivros() {

        if (carregandoMais.current || !temMaisLivros) return;
        carregandoMais.current = true;
        
        const resposta = await listarLivros(livros.length);

        setLivros(livrosAtuais => [
            ...livrosAtuais,
            ...resposta.results
        ]);

        setTemMaisLivros(resposta.next !== null);
    }

    return (
        
        <InfiniteScroll
            className="grid relative grid-cols-2 w-full gap-7.5"
            dataLength={livros.length}
            next={carregarMaisLivros}
            hasMore={temMaisLivros}
            loader={
                <div className="flex col-span-2 justify-center items-center w-full">
                    <Loader />
                </div>
            }
            style={{ overflow: "visible"}}
            scrollThreshold={0.2}
        >
            
                {livros.map(livro => (
                    livro.edicoes.map(edicao => (
                        <LivroCard
                            key={edicao.id}
                            autor={livro.autor}
                            titulo={livro.titulo}
                            image={edicao.capa ?? ""}
                        />
                    ))
                ))}

                
            
        </InfiniteScroll>
    );
}