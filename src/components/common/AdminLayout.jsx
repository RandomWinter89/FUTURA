import { Outlet } from "react-router-dom"
import { Header } from "../admin";

const AdminLayout = () => {

    return (
        < >
            <Header/>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default AdminLayout;