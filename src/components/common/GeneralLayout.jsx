import { Outlet } from "react-router-dom"
import { Header } from "../shop";

const GeneralLayout = () => {
    
    return (
        < >
            <Header />
            <main className="flex flex-col gap-20 my-10">
                <Outlet />
            </main>
        </>
    )
}

export default GeneralLayout;