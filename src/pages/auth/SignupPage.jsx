import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { registerUser } from "../../features/usersSlice";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

import AuthShowcase from "../../assets/AuthShowcase.png";

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

            dispatch(registerUser({uid, email}));
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

    const onNavigate_Login = () => navigate("/Auth/Signup")

    return (
        < >
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="flex flex-col gap-2 mb-8 text-center">
                    <h1>Welcome Back!</h1>
                    <p className="font-medium text-lg leading-9">Log In to continue</p>
                </div>
                
                <form onSubmit={onRegisterAccount} className="flex flex-col gap-3 w-[30rem]">
                    <input 
                        type="email" 
                        value={email}
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
                        className="min-h-14 px-4 py-2 border border-gray-400"
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

                    <button 
                        type="submit" 
                        className="bg-black text-white text-sm font-semibold h-14 px-4 py-4 mt-5"
                    >
                        Confirm
                    </button>

                    {feedback.trim().length != 0 && <p className="text-xl text-red-400">{feedback}</p>}
                </form>

                {/* <p>Forget password? <a className="text-red-400">Reset Password</a></p> */}
                <p className="mt-4 flex gap-2">Have Account? <a className="underline font-bold" onClick={onNavigate_Login}>Login</a></p>
            </div>

            <img src={AuthShowcase} className="flex-[0.5] object-cover" />
        </>
    )
}

export default SignupPage;