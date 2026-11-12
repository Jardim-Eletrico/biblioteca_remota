import Appnavbar from "../components/app/appnavbar";
import { Outlet } from "react-router-dom";

export default function Applayout() {
    return(
        <div className="min-h-screen flex flex-col bg-gray-background dark:bg-gray-900 transition-all duration-300 ease-in-out">
            <Appnavbar />

            <main className="px-5">
                
                <Outlet />
            </main>
        </div>
    )
}

