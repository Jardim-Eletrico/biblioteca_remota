import Pubnavbar from "../components/pub/pubnavbar";
import { Outlet } from "react-router-dom";

export default function Publayout(){
    return(
        <div className="min-h-screen flex flex-col">
            <Pubnavbar />
            <main className="flex flex-col items-center gap-10 sm:gap-10 px-5 flex-1 grow bg-gray-background relative isolate antialiased">
                <Outlet />
            </main>
        </div>
    );
}