import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./ui/pages/landing/landing";
import Publayout from "../layouts/publayout";
import Auth from "./ui/pages/auth/auth";
import Applayout from "../layouts/applayout";
import Home from "./ui/pages/home/home";

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
                    
                    </Route>
                    
                </Routes>


            </BrowserRouter>
        </>
    )
}