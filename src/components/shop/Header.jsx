import { AuthContext } from "../../Context/AuthProvider";
import { getAuth } from "firebase/auth";

import { useContext } from "react";
import { useDispatch } from "react-redux";

import { userCheckout } from "../../features/usersSlice";
import { NavLink } from "../common";
import { Button } from "../ui";

import Futura from "../../assets/Futura.png";
import cart from "../../assets/svg/cart_outline.svg";
import heart from "../../assets/svg/heart_outline.svg";
import profile from "../../assets/svg/profile_outline.svg";

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
            <header className="w-full h-26 py-6 px-9 bg-white border-b border-gray-300 text-black font-sans flex justify-between">
                <nav className="flex justify-center items-center gap-6 max-lg:gap-4 max-md:flex-col max-sm:gap-1">
                    <NavLink path={"/Shop/Homepage"} variant={"homepage"} type={"homepage"} className={"flex"}>
                        <img src={Futura} className="object-cover" />
                    </NavLink>
                    <NavLink path={"/Shop/Category"}>
                        Category
                    </NavLink>
                </nav>
                
                <nav className="flex justify-center items-center gap-8 max-lg:gap-4 max-md:flex-col max-sm:gap-1">
                    {!currentUser && (
                        < >
                            <NavLink path={"/Auth/Login"} variant={"auth"} type={"positive"}>
                                Login
                            </NavLink>
                            <NavLink path={"/Auth/Signup"} variant={"auth"} type={"positive"}>
                                Signup
                            </NavLink>
                        </>
                    )}

                    {currentUser && (
                        < >
                            <NavLink path={"/User/Wishlist"}>
                                <img src={heart} />
                            </NavLink>

                            <NavLink path={"/User/Cart"}>
                                <img src={cart} />
                            </NavLink>

                            
                            {/* <NavLink path={"/User/Order"}>Order</NavLink> */}
                            <NavLink path={"/User/Profile"}>
                                <img src={profile} />
                            </NavLink>

                            <Button onClick={handleLogout} variant={"primary_outline"} state={"fit"}> 
                                Log out
                            </Button>
                        </>
                    )}
                </nav>
            </header>
        </>
    )
}

export default Header;