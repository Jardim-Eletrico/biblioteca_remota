
import Pubnavbar from "@/components/pubnavbar";
import { Outlet } from "react-router-dom";

export default function Publayout(){
    return(
        <div className="min-h-screen flex flex-col">
            <Pubnavbar />
            <main className="flex flex-col items-center gap-5 px-[20px] bg-grey-background grow">
                <Outlet />
            </main>
        </div>
    );
}