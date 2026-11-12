import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./ui/pages/landing/landing";
import Publayout from "../layouts/publayout";
import Auth from "./ui/pages/auth/auth";
import Applayout from "../layouts/applayout";
import Home from "./ui/pages/home/home";
import TesteDesejoCard from "./ui/pages/test/TesteDesejoCard";
import TesteNotificacaoCard from "./ui/pages/TesteNotificacaoCard";
import TesteAvaliacaoModal from "./ui/pages/TesteAvaliacaoModal";


import GestaoEmprestimos from "@/src/ui/pages/bibliotecario/GestaoEmprestimos";
import CadastroBibliotecario from "@/src/ui/pages/bibliotecario/CadastroBibliotecario";
import GestaoLeitores from "./ui/pages/bibliotecario/GestaoLeitores";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Publayout />}>
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/auth" element={< Auth />} />
                    </Route>

                    <Route element={<Applayout />}>
                        <Route path="/home" element={<Home />}></Route>
                        <Route path="/teste-desejos" element={<TesteDesejoCard />}></Route>
                        <Route path="/teste-notificacoes" element={<TesteNotificacaoCard />}></Route>
                        <Route path="/teste-avaliacao" element={<TesteAvaliacaoModal />}></Route>
                        <Route path="/gestao-emprestimos" element={<GestaoEmprestimos />}/>
                        <Route path="/cadastro-bibliotecario" element={<CadastroBibliotecario />}/>
                        <Route path="/gestao-leitores" element={<GestaoLeitores />}/>
                    </Route>

                </Routes>


            </BrowserRouter>
        </>
    )
}