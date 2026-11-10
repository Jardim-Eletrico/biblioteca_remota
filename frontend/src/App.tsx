
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import { CarrinhoProvider } from "@/src/contexts/carrinhoContext";

import Landing from "./ui/pages/landing/landing";
import Publayout from "../layouts/publayout";
import Auth from "./ui/pages/auth/auth";
import Applayout from "../layouts/applayout";
import Home from "./ui/pages/home/home";

import TesteDesejoCard from "./ui/pages/test/TesteDesejoCard";
import TesteNotificacaoCard from "./ui/pages/TesteNotificacaoCard";
import TesteAvaliacaoModal from "./ui/pages/TesteAvaliacaoModal";

export default function App() {

    return (
        <BrowserRouter>

            <CarrinhoProvider>

                <Routes>

                    {/* ROTAS PÚBLICAS */}
                    <Route element={<Publayout />}>
                        <Route
                            path="/landing"
                            element={<Landing />}
                        />

                        <Route
                            path="/auth"
                            element={<Auth />}
                        />
                    </Route>


                    {/* ROTAS AUTENTICADAS */}
                    <Route element={<Applayout />}>

                        <Route
                            path="/home"
                            element={<Home />}
                        />

                        <Route
                            path="/teste-desejos"
                            element={<TesteDesejoCard />}
                        />

                        <Route
                            path="/teste-notificacoes"
                            element={<TesteNotificacaoCard />}
                        />

                        <Route
                            path="/teste-avaliacao"
                            element={<TesteAvaliacaoModal />}
                        />

                    </Route>

                </Routes>

            </CarrinhoProvider>

        </BrowserRouter>
    );
}
