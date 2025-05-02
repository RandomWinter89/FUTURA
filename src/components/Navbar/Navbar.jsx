import { Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import { getAuth } from "firebase/auth";

import { useEffect, useContext } from "react";

const Navbar = () => {
    const { currentUser } = useContext(AuthContext) || null;
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        if (currentUser == null)
            navigate("/Homepage");
    }, [])

    const handleLogout = () => auth.signOut();

    return (
        < >
            <div className="w-full h-26 py-6 px-9 bg-[#E6E6E6] text-black font-sans flex justify-between">
                <nav className="h-fit flex gap-6">
                    <Link to="/Homepage" className="text-5xl">FUTURA</Link>
                    <Link to="/Category" className="text-2xl">Category</Link>
                    <Link to="/Promotion" className="text-2xl">Promotion</Link>
                </nav>
                
                <nav className="h-fit flex gap-6">
                    <Link to="/Cart" className="text-2xl">Carts</Link>
                    {!currentUser && (
                        <div className="flex gap-3">
                            <Link to="/Login" className="text-2xl">Login</Link>
                            <hr className="border-r border-black" />
                            <Link to="/Signup" className="text-2xl">Signup</Link>
                        </div>
                    )}
                    {currentUser && (
                        < >
                            <Link to="/Wishlist" className="text-2xl">Wishlist</Link>
                            <div className="flex gap-3">
                                <Link to="/Profile" className="text-2xl">Profile</Link>
                                <hr className="h-full border-r-2 border-black" />
                                <button 
                                    onClick={handleLogout}
                                    className="flex justify-start text-2xl"
                                >Exit</button>
                            </div>
                        </>
                    )}
                </nav>
            </div>
            <Outlet />
        </>
    )
}

export default Navbar;