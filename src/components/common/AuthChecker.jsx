import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userCheckout } from "../../features/usersSlice";
import { useEffect } from "react";

const AuthChecker = ({auth_user, data_user, status, children}) => {
    const location = useLocation().pathname;
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'succeed' && !auth_user && data_user) {
            console.log("Catcher: ", data_user);
            dispatch(userCheckout());
        }
    }, [dispatch, auth_user, data_user, status]);

    // ==========================

    if (location === "/") {
        if (!auth_user) {
            return <Navigate to="/Auth/Login" />
        } else {
            if (status === 'succeed' && data_user.role === "ADMIN") {
                return <Navigate to="/Admin/Dashboard" />
            } else if (status === 'succeed' && data_user.role === "USER") {
                return <Navigate to="/Shop/Homepage" />
            }
        }
    }

    //Direct user to login:
    //1. Not authorized
    //2. Access restricted path
    if (!auth_user && status == 'idle' && !(location.startsWith("Shop") || location.startsWith("Auth")) ) {
        console.log("Valid to Login");
        return <Navigate to="/Auth/Login" />
    }

    //Direct user to Register:
    //1. Authorized
    //2. No record of the user
    //3. The REPORT MUST BE FROM USER SLICE!!!
    if (auth_user && !data_user && status == 'failed' && !location.startsWith("/Auth/Register")) {
        console.log("Valid to Register");
        return <Navigate to="/Auth/Register" />
    }

    //Direct user to admin
    //1. Role is admin
    //2. Access restricted path (Login, Shop, or User)
    if (data_user?.role === "ADMIN" && status == 'succeed' && (location.startsWith("/Auth") || location.startsWith("/Shop") || location.startsWith("/User")))
    {   
        console.log("Valid to Admin");
        return <Navigate to="/Admin/Dashboard" />
    }

    //Direct user to homepage
    //1. Role is user
    //2. Access restricted path (Login or Admin)
    if (data_user?.role === "USER" && status == 'succeed' && (location.startsWith("/Auth") || location.startsWith("/Admin")))
    {
        console.log("Valid to Homepage");
        return <Navigate to="/Shop/Homepage" />
    }

    console.log("Everything is valid");

    return (
        < >
            {children}
        </>
    )
}

export default AuthChecker;