import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userCheckout } from "../../features/usersSlice";

const AuthChecker = ({auth_user, data_user, loading, children}) => {
    const location = useLocation().pathname;
    const dispatch = useDispatch();

    // ==========================
    console.log("Hi, We're the maintainer of AuthChecker");
    console.log("We're locating at: ", location);
    console.log("We do checking to ensure it correct: ", data_user?.role);

    //Catcher: Responsible if data failed to checkout
    if (!auth_user && data_user)
        dispatch(userCheckout());

    //Direct user to login:
    //1. Not authorized
    //2. Access restricted path
    if (!auth_user && !(location.includes("Shop") || location.includes("Auth")) ) {
        return <Navigate to="/Auth/Login" />
    }

    //Direct user to Register:
    //1. Authorized
    //2. No record of the user
    //3. The REPORT MUST BE FROM USER SLICE!!!
    if (auth_user && !data_user) {
        return <Navigate to="/Auth/Register" />
    }

    //Direct user to admin
    //1. Role is admin
    //2. Access restricted path (Login, Shop, or User)
    if (data_user?.role === "ADMIN" && (location.includes("/Auth") || location.includes("/Shop") || location.includes("/User")))
        return <Navigate to="/Admin/Dashboard" />

    //Direct user to homepage
    //1. Role is user
    //2. Access restricted path (Login or Admin)
    if (data_user?.role === "USER" && (location.includes("/Auth") || location.includes("/Admin")))
        return <Navigate to="/Shop/Homepage" />

    return (
        < >
            {children}
        </>
    )
}

export default AuthChecker;