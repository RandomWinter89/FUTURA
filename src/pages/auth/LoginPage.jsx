import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { readCurrentUserProfile } from "../../features/usersSlice";
import { useState } from "react";

import AuthShowcase from "../../assets/AuthShowcase.png";
import { Button } from "../../components/ui";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [hide, setHide] = useState(true);
    const [inputType, setInputType] = useState("password");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const onShowPassword = () => {
        if (hide) {
            setInputType("text");
        } else {
            setInputType("password");
        }

        setHide(!hide);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const feedback = await signInWithEmailAndPassword(auth, email, password);
            dispatch(readCurrentUserProfile(feedback.user.uid));
        } catch (error) {
            setError("Invalid: ", error.message);
            console.error("Error in Login: ", error);
        }
    }

    const onNavigate_Signup = () => {
        navigate("/Auth/Signup");
    }

    return (
        < >
            <div className="flex-1 flex flex-col justify-center items-center max-md:px-10">
                <div className="flex flex-col gap-2 mb-8 text-center">
                    <h1>Welcome Back!</h1>
                    <p>Log In to continue</p>
                </div>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-3 w-[30rem] max-md:w-full">
                    <input 
                        type="email" 
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value.toLowerCase())} 
                    />

                    <div className="flex relative">
                        <input 
                            type={inputType} 
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 pl-4 pr-12 py-4 border border-gray-400"
                        />

                        <input 
                            type="checkbox" 
                            value={!hide}
                            onChange={onShowPassword}
                            className="size-5 absolute top-[50%] right-2 translate-x-[-50%] translate-y-[-50%]"
                        />
                    </div>
                    
                    <Button type="submit" >
                        Login
                    </Button>
                    {error.trim().length != 0 && <p className="text-xl text-red-400">{error}</p>}
                </form>

                {/* <p>Forget password? <a className="text-red-400">Reset Password</a></p> */}
                <p className="mt-4 flex items-center gap-2">
                    No Account yet? 
                    <span className="underline font-bold cursor-pointer" onClick={onNavigate_Signup}>
                        Signup
                    </span>
                </p>
            </div>

            <img src={AuthShowcase} className="flex-[0.5] object-cover max-md:hidden" />
        </>
    )
}

export default LoginPage;