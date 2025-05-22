import { Outlet } from "react-router-dom"
import { Header } from "../shop";
import { memo } from "react";

const GeneralLayout = memo(() => {
    
    return (
        <div className="flex flex-col min-h-svh ">
            <Header />
            <main className="flex-1 flex">
                <Outlet />
            </main>
        </div>
    )
});

export default GeneralLayout;