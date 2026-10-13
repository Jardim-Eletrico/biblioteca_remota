import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "@/src/ui/pages/landing/landing";
import Publayout from "@/layouts/publayout";
import Login from "./ui/pages/login_and_signup/login";
import Signup from "./ui/pages/login_and_signup/signup";
import Applayout from "@/layouts/applayout";
import Home from "./ui/pages/home/home";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Publayout />}>
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={< Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>

                    <Route element={<Applayout />}>
                        <Route path="/home" element={<Home />}></Route>
                    
                    </Route>
                    
                </Routes>


            </BrowserRouter>
        </>
    )
}