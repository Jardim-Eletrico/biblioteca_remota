
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

// Proteção de rotas
import RotaBibliotecario from "@/components/app/RotaBibliotecario";

// Testes
import TesteDesejoCard from "./ui/pages/desejo/PageDesejoCard";
import TesteNotificacaoCard from "./ui/pages/notificacao/PageNotificacaoCard";
import TesteAvaliacaoModal from "./ui/pages/avaliacao/TesteAvaliacaoModal";
import TesteLivroDetalhes from "./ui/pages/livros/PageLivroDetalhes";
import TesteCarrinho from "./ui/pages/carrinho/Carrinho";

// Gestão do bibliotecário
import GestaoEmprestimos from "@/src/ui/pages/bibliotecario/GestaoEmprestimos";
import CadastroBibliotecario from "@/src/ui/pages/bibliotecario/CadastroBibliotecario";
import GestaoLeitores from "./ui/pages/bibliotecario/GestaoLeitores";
import CadastroLivro from "./ui/pages/bibliotecario/CadastroLivro";
import GestaoLivros from "./ui/pages/bibliotecario/GestaoLivros";

// Perfil
import Perfil from "./ui/pages/perfil/perfil";
import TesteConfirmarReserva from "./ui/pages/confirmarReserva/TesteConfirmarReserva";
import MeusEmprestimos from "./ui/pages/leitor/emprestimos_pedidos/MeusEmprestimos";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route element={<Publayout />}>
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                </Route>

                {/* Rotas autenticadas */}
                <Route element={<Applayout />}>
                    <Route path="/home" element={<Home />} />

                    <Route path="/desejos" element={<TesteDesejoCard />} />
                    <Route path="/notificacoes" element={<TesteNotificacaoCard />} />
                    <Route path="/teste-avaliacao" element={<TesteAvaliacaoModal />} />
                    <Route path="/detalhes-livro/:edicaoId" element={<TesteLivroDetalhes />} />
                    <Route path="/carrinho" element={<TesteCarrinho />} />
                    <Route path="/reserva" element={<TesteConfirmarReserva />} />
                    <Route path="/meus-emprestimos" element={<MeusEmprestimos />} />

                    {/* Rotas exclusivas do bibliotecário */}
                    <Route element={<RotaBibliotecario />}>
                        <Route path="/gestao-emprestimos" element={<GestaoEmprestimos />} />
                        <Route path="/cadastro-bibliotecario" element={<CadastroBibliotecario />} />
                        <Route path="/gestao-leitores" element={<GestaoLeitores />} />
                        <Route path="/cadastro-livro" element={<CadastroLivro />} />
                        <Route path="/gestao-livros" element={<GestaoLivros />} />
                    </Route>

                    {/* Perfil */}
                    <Route path="/perfil" element={<Perfil />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
