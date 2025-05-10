import { Outlet, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import { getAuth } from "firebase/auth";

import { NavLink } from "../common";

import { useContext } from "react";

const Header = () => {
    const { currentUser } = useContext(AuthContext) || null;
    const auth = getAuth();

    const handleLogout = () => auth.signOut();

    return (
        < >
            <div className="w-full h-26 py-6 px-9 bg-[#E6E6E6] text-black font-sans flex justify-between">
                <nav className="h-fit flex gap-6 max-lg:gap-4 max-sm:flex-col max-sm:gap-1">
                    <Link to="/Shop/Homepage" className="text-5xl max-lg:text-3xl max-sm:text-lg max-sm:font-bold">FUTURA</Link>
                    <NavLink path={"/Shop/Category"} name={"Category"}/>
                    <NavLink path={"/Shop/Promotion"} name={"Promotion"}/>
                </nav>
                
                <nav className="h-fit flex gap-6 items-end max-sm:gap-2 max-sm:flex-col">
                    <Link to="/User/Cart" className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all">
                        Carts
                    </Link>

                    {!currentUser && (
                        <div className="flex gap-3">
                            <Link to="/Auth/Login" className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all">
                                Login
                            </Link>
                            
                            <hr className="border-r border-black" />

                            <Link to="/Auth/Signup" className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all">
                                Signup
                            </Link>
                        </div>
                    )}

                    {currentUser && (
                        < >
                            <Link to="/User/Wishlist" className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all">Wishlist</Link>
                            <Link to="/User/Order" className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all">Order</Link>
                            <Link to="/User/Profile" className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all">
                                Profile
                            </Link>

                            <button 
                                onClick={handleLogout}
                                className="text-2xl text-right max-lg:text-xl max-sm:text-sm hover:bg-black hover:w-full hover:p-2 hover:rounded-md hover:text-white transition-all"
                            >Exit</button>
                           
                        </>
                    )}
                </nav>
            </div>
        </>
    )
}

export default Header;