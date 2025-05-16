import { AuthContext } from "../../Context/AuthProvider";
import { getAuth } from "firebase/auth";

import { useContext } from "react";
import { useDispatch } from "react-redux";

import { userCheckout } from "../../features/usersSlice";
import { NavLink } from "../common";
import { Button } from "../ui";

import "../UI.css";

const Header = () => {
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();
    const auth = getAuth();
    
    const handleLogout = () => {
        auth.signOut()
            .then(() => { 
                dispatch(userCheckout()) 
            });
    };

    return (
        < >
            <header className="w-full h-26 py-6 px-9 bg-[#E6E6E6] text-black font-sans flex justify-between">
                <nav className="flex justify-center items-center gap-6 max-lg:gap-4 max-md:flex-col max-sm:gap-1">
                    <NavLink path={"/Shop/Homepage"} name={"FUTURA"} variant={"homepage"} type={"base"}/>
                    <NavLink path={"/Shop/Category"} name={"Category"} />
                </nav>
                
                <nav className="flex justify-center items-center gap-4 max-lg:gap-4 max-md:flex-col max-sm:gap-1">
                    {!currentUser && (
                        < >
                            <NavLink path={"/Auth/Login"} name={"Login"} variant={"auth"} type={"positive"}/>
                            <NavLink path={"/Auth/Signup"} name={"Signup"} variant={"auth"} type={"positive"}/>
                        </>
                    )}

                    {currentUser && (
                        < >
                            <NavLink path={"/User/Cart"} name={"Carts"}/>
                            <NavLink path={"/User/Wishlist"} name={"Wishlist"} />
                            <NavLink path={"/User/Order"} name={"Order"} />
                            <NavLink path={"/User/Profile"} name={"Profile"} />
                            <Button onClick={handleLogout} variant={"base"} state={"negative"}> 
                                Logout
                            </Button>
                        </>
                    )}
                </nav>
            </header>
        </>
    )
}

export default Header;