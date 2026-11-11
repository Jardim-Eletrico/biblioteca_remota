import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { listarLivros } from "@/src/services/livrosService";
import type { LivroComEdicoes } from "@/src/types/livro";
import { buscarPerfil } from "@/src/services/perfilService";
import LivroCard from "@/components/app/landing/livro_card";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/app/loader_animation/loader";


export default function Home() {
    const acess = localStorage.getItem("access");
    const [livros, setLivros] = useState<LivroComEdicoes[]>([]);
    const [temMaisLivros, setTemMaisLivros] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarLivros() {
            try {

                // if (!acess) {
                //     navigate("/auth");
                // }

                await buscarPerfil();

                const resposta = await listarLivros(0);

                setLivros(resposta.results);
                setTemMaisLivros(resposta.next !== null);
            } catch (error) {
                console.error(error);
            } 
        }

        carregarLivros();
    }, []);

    async function carregarMaisLivros() {
        const resposta = await listarLivros(livros.length);

        setLivros(livrosAtuais => [
            ...livrosAtuais,
            ...resposta.results
        ]);

        setTemMaisLivros(resposta.next !== null);
    }

    return (
        <InfiniteScroll
            dataLength={livros.length}
            next={carregarMaisLivros}
            hasMore={temMaisLivros}
            loader={<Loader className="flex items-center justify-center pt-5"/>}
            endMessage={<p>Você chegou ao fim do acervo.</p>}
            style={{ overflow: "visible"}}
        >
            <div className="grid grid-cols-2 w-full gap-7.5">
                {livros.map((livro) => (
                    <div key={livro.id}>
                        {livro.edicoes.map((edicao) => (
                            <LivroCard
                                key={edicao.id}
                                autor={livro.autor}
                                titulo={livro.titulo}
                                image={edicao.capa ?? ""}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
}