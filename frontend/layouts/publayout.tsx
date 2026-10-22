import Pubnavbar from "../components/pub/pubnavbar";
import { Outlet } from "react-router-dom";

export default function Publayout(){
    return(
        <div className="min-h-screen flex flex-col">
            <Pubnavbar />
            <main className="flex flex-col items-center gap-5 bg-grey-background grow relative isolate antialiased">
                <Outlet />
            </main>
        </div>
    );
}