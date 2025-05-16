import { Outlet } from "react-router-dom"
import { Header } from "../shop";
import { memo } from "react";

const GeneralLayout = memo(() => {
    
    return (
        < >
            <Header />
            <main className="min-h-[88svh] flex">
                <Outlet />
            </main>
        </>
    )
});

export default GeneralLayout;