
import Appnavbar from "@/components/appnavbar";
import {  Outlet } from "react-router-dom";

export default function Applayout() {
    return(
        <div className="min-h-screen flex flex-col">
            <Appnavbar />

            <main>
                <Outlet />
            </main>
        </div>
    )
}