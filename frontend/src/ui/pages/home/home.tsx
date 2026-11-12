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

    const [inputQuery, setInputQuery] = useState("");

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
    }, [inputQuery]);

    async function carregarMaisLivros() {

        console.log("CHAMOU CARREGAR MAIS");
        console.log("Quantidade atual:", livros.length);
        console.log("Tem mais:", temMaisLivros);

        if (carregandoMais.current || !temMaisLivros) return;

        carregandoMais.current = true;

        try {
            const resposta = await listarLivros(livros.length, inputQuery);
            console.log("Resposta da API:", resposta);
            console.log("Resultados:", resposta.results);

            setLivros(livrosAtuais => [
                ...livrosAtuais,
                ...resposta.results
            ]);

            setTemMaisLivros(resposta.next !== null);
        } catch (error) {
            console.error(error);
        } finally {
            carregandoMais.current = false;
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const resultado = await listarLivros(0, inputQuery);

            setLivros(resultado.results);
            setTemMaisLivros(resultado.next !== null);

            console.log(resultado);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>

            <form 
            onSubmit={handleSubmit}
            method="GET"
            className="relative w-full"
            >

                <input 
                type="text"
                placeholder="Harry Potter, Iracema, Senhor dos Anéis..."
                className="flex items-center w-full h-12 pl-3 pr-15 rounded-4xl bg-white border-2 border-gray-stroke outline-0 font-ubuntu"
                value={inputQuery}
                onChange={(e) => {setInputQuery(e.target.value); handleSubmit}}
                />
                
                <button 
                type="submit"
                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>

                </button>

            </form>

            <InfiniteScroll
                className="grid relative grid-cols-2 w-full gap-7.5 sm:grid-cols-3 md:grid-cols-6 object-contain"
                dataLength={livros.length}
                next={carregarMaisLivros}
                hasMore={temMaisLivros}
                loader={
                    <div className="flex col-span-2 sm:col-span-3 justify-center items-center w-full">
                        <Loader />
                    </div>
                }
                style={{ overflow: "visible"}}
                scrollThreshold={0.8}
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

        </>
    );
}