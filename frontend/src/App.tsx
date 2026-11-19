import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Landing from "./ui/pages/landing/landing";
import Publayout from "../layouts/publayout";
import Auth from "./ui/pages/auth/auth";
import Applayout from "../layouts/applayout";
import Home from "./ui/pages/home/home";

import TesteDesejoCard from "./ui/pages/test/TesteDesejoCard";
import TesteNotificacaoCard from "./ui/pages/test/TesteNotificacaoCard";
import TesteAvaliacaoModal from "./ui/pages/test/TesteAvaliacaoModal";
import TesteLivroDetalhes from "./ui/pages/test/TesteLivroDetalhes";
import TesteCarrinho from "./ui/pages/test/TesteCarrinho";

import GestaoEmprestimos from "@/src/ui/pages/bibliotecario/GestaoEmprestimos";
import CadastroBibliotecario from "@/src/ui/pages/bibliotecario/CadastroBibliotecario";
import GestaoLeitores from "./ui/pages/bibliotecario/GestaoLeitores";
import CadastroLivro from "./ui/pages/bibliotecario/CadastroLivro";
import GestaoLivros from "./ui/pages/bibliotecario/GestaoLivros";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ROTAS PÚBLICAS */}
                <Route element={<Publayout />}>
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                </Route>

                {/* ROTAS AUTENTICADAS */}
                <Route element={<Applayout />}>
                    <Route path="/home" element={<Home />} />

                    <Route path="/desejos" element={<TesteDesejoCard />} />
                    <Route path="/notificacoes" element={<TesteNotificacaoCard />} />
                    <Route path="/teste-avaliacao" element={<TesteAvaliacaoModal />} />
                    <Route path="/detalhes-livro/:edicaoId" element={<TesteLivroDetalhes />} />
                    <Route path="/carrinho" element={<TesteCarrinho />} />

                    <Route path="/gestao-emprestimos" element={<GestaoEmprestimos />} />
                    <Route path="/cadastro-bibliotecario" element={<CadastroBibliotecario />} />
                    <Route path="/gestao-leitores" element={<GestaoLeitores />} />
                    <Route path="/cadastro-livro" element={<CadastroLivro />} />
                    <Route path="/gestao-livros" element={<GestaoLivros />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}