import { AuthContext } from "../../Context/AuthProvider";
import { getAuth } from "firebase/auth";

import { useContext } from "react";
import { useDispatch } from "react-redux";

import { userCheckout } from "../../features/usersSlice";

import { NavLink } from "../common";
import { Button } from "../ui";

const Header = () => {
    const { currentUser } = useContext(AuthContext) || null;
    const auth = getAuth();
    const dispatch = useDispatch();

    const handleLogout = () => {
        auth.signOut()
            .then(() => {dispatch(userCheckout())});
    };

    return (
        <div className="w-full h-26 py-6 px-9 bg-[#E6E6E6] font-sans flex justify-between">
            <nav className="flex items-center gap-6 max-md:gap-4 max-md:flex-col max-sm:gap-2">
                <NavLink path={"/Admin/Dashboard"} variant={"homepage"} type={"base"}>
                    Admin Dashboard
                </NavLink>

                <NavLink path={"/Admin/Products"}>
                    Products
                </NavLink>

                <NavLink path={"/Admin/Orders"}>
                    Orders
                </NavLink>
            </nav>

            <nav className="flex items-center gap-2 max-md:flex-col max-md:gap-1">
                {!currentUser 
                    ?   <div className="flex gap-3">
                            <NavLink path={"/Auth/Login"} name={"Login"} variant={"auth"} type={"positive"} />
                            <NavLink path={"/Auth/Signup"} name={"Signup"} variant={"auth"} type={"positive"} />
                        </div>
                    :   <Button onClick={handleLogout} variant={"primary_filled"} state={"fit"}>
                            Exit
                        </Button>
                }
            </nav>
        </div>
    )
}

export default Header;