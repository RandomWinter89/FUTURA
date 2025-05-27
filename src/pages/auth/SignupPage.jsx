import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { registerUser } from "../../features/usersSlice";
import { createUserWishlistID } from "../../features/wishlistSlice";
import { createCart } from "../../features/cartsSlice";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

import AuthShowcase from "../../assets/AuthShowcase.png";
import { Button } from "../../components/ui";

const SignupPage = () => {
    // Email & Password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Dispatch Event
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth();

    // Password Feedback
    const [hide, setHide] = useState(true);
    const [hideB, setHideB] = useState(true);
    const [inputType, setInputType] = useState("password");
    const [inputTypeB, setInputTypeB] = useState("password");

    // Feedback Error
    const [feedback, setFeedback] = useState("");

    const onRegisterAccount = async (e) => {
        e.preventDefault();

        if (password.trim().length === 0 || confirmPassword.trim().length === 0 || email.trim().length === 0)
            return setFeedback("Please fill-up the empty input");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email))
            return setFeedback("Invalid Email");

        if (password.trim().length < 6)
            return setFeedback("Please ensure the password is 6 digit long");

        if (password != confirmPassword)
            return setFeedback("Confirm Password and Password aren't the same");

        try {
            const feedback = await createUserWithEmailAndPassword(auth, email, password);
            const uid = feedback.user.uid;

            dispatch( registerUser({uid, email}) )
                .then(() => dispatch( createUserWishlistID(uid) ))
                .then(() => dispatch( createCart(uid) ))
            setFeedback("");
        } catch (error) {
            console.log(error);
        }
    }

    const onShowPassword = () => {
        setInputType(hide ? "text" : "password");
        setHide(!hide);
    }

    const onShowPasswordB = () => {
        setInputTypeB(hideB ? "text" : "password");
        setHideB(!hideB);
    }

    const onNavigate_Login = () => navigate("/Auth/Login")

    return (
        < >
            <div className="flex-1 flex flex-col justify-center items-center max-md:px-10">
                <div className="flex flex-col gap-2 mb-8 text-center">
                    <h1>Welcome Back!</h1>
                    <p>Log In to continue</p>
                </div>
                
                <form onSubmit={onRegisterAccount} className="flex flex-col gap-3 w-[30rem] max-md:w-full">
                    <input 
                        type="email" 
                        value={email}
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
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

                    <div className="flex relative">
                        <input 
                            type={inputTypeB}
                            placeholder="Enter Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="flex-1 pl-4 pr-12 py-4 border border-gray-400"
                        />

                        <input 
                            type="checkbox" 
                            value={!hideB}
                            onChange={onShowPasswordB}
                            className="size-5 absolute top-[50%] right-2 translate-x-[-50%] translate-y-[-50%]"
                        />
                    </div>

                    <Button type="submit">
                        Confirm
                    </Button>

                    {feedback.trim().length != 0 && <p className="text-xl text-red-400">{feedback}</p>}
                </form>

                <p className="mt-4 flex items-center gap-2">
                    Have Account? 
                    <span className="underline font-bold cursor-pointer" onClick={onNavigate_Login}>
                        Login
                    </span>
                </p>
            </div>

            <img src={AuthShowcase} className="flex-[0.5] object-cover max-md:hidden" />
        </>
    )
}

export default SignupPage;