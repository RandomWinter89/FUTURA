import { Outlet } from "react-router-dom"
import { Header } from "../admin";

const AdminLayout = () => {

    return (
        <div className="flex flex-col min-h-svh ">
            <Header/>
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout;