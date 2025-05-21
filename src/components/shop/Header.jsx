import { AuthContext } from "../../Context/AuthProvider";
import { getAuth } from "firebase/auth";

import { useContext } from "react";
import { useDispatch } from "react-redux";

import { userCheckout } from "../../features/usersSlice";
import { NavLink, ToggleMode } from "../common";
import { Button } from "../ui";

import Futura from "../../assets/Futura.png";
import { IconCartOutline, IconHeart, IconProfile, IconMenu, IconClosed } from "../../components/icon";
import { useState } from "react";

const Header = () => {
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();
    const auth = getAuth();

    const [isOpen, setIsOpen] = useState(false);
    
    const handleLogout = () => {
        auth.signOut()
            .then(() => { 
                dispatch(userCheckout()) 
            });
    };

    const toggleBurger = () => {
        setIsOpen(!isOpen);
    }

    return (
        < >
            <header className="relative w-full h-26 flex justify-between py-6 px-9 bg-white dark:bg-black border-b border-gray-300 text-black dark:text-white max-sm:px-4">
                <nav className="flex justify-center items-center gap-6 max-lg:gap-4 max-md:flex-col max-md:items-start">
                    <NavLink path={"/Shop/Homepage"} variant={"homepage"} type={"homepage"} className={"max-md:p-0"}>
                        <img src={Futura} className="object-cover" />
                    </NavLink>
                    
                    <NavLink path={"/Shop/Category"} type={"homepage"}>
                        Category
                    </NavLink>
                </nav>
                
                <nav className={`h-auto w-auto flex bg-white dark:bg-black items-center gap-8 max-md:flex-col max-sm:gap-4 `}>
                    <div state={"fit"} onClick={toggleBurger} className={"hidden cursor-pointer max-md:block group hover:scale-125 hover:rotate-[360deg] transition-all duration-300"}>
                        {isOpen 
                            ? <IconClosed className={"stroke-black group-hover:stroke-orange-600"} /> 
                            : <IconMenu className={"stroke-black group-hover:stroke-orange-600"}/>
                        }
                    </div>

                    <div className={`flex justify-center items-center gap-8 max-lg:gap-4
                            ${isOpen 
                                ? "max-md:absolute max-md:top-full max-md:left-0 max-md:w-full max-md:h-[80%] max-md:p-2 max-md:justify-around max-md:items-center max-md:bg-white      max-md:border-y max-md:border-gray-300 " 
                                : "max-md:hidden"
                            }
                        `}
                    >
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
                                <NavLink path={"/User/Wishlist"} type={"homepage"}>
                                    <IconHeart filled={false} className={"text-black dark:text-white hover:text-orange-600 hover:scale-150 transition-all duration-300"} />
                                </NavLink>

                                <NavLink path={"/User/Cart"} type={"homepage"}>
                                    <IconCartOutline className={"text-black dark:text-white hover:text-orange-600 hover:scale-150 transition-all duration-300"} />
                                </NavLink>

                                <NavLink path={"/User/Profile"}  type={"homepage"}>
                                    <IconProfile className={"stroke-black dark:stroke-white hover:stroke-orange-600 hover:scale-150 transition-all duration-300"} />                                
                                </NavLink>

                                <ToggleMode />

                                <Button onClick={handleLogout} variant={"primary_outline"} state={"fit"}> 
                                    Log out
                                </Button>
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header;