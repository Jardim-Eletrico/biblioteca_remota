import Appnavbar from "../components/app/appnavbar";
import { Outlet } from "react-router-dom";

export default function Applayout() {
    return(
        <div className="min-h-screen flex flex-col gap-3 bg-gray-background dark:bg-gray-900 transition-all duration-300 ease-in-out overflow-x-hidden">
            <Appnavbar />

            <main className="flex flex-col gap-3 sm:gap-10 px-5">
                
                <Outlet />
            </main>
        </div>
    )
}

