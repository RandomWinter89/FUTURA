import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { createUser, uploadUser_Image } from "../../features/usersSlice";

import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    // Email & Password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageUrl, setImageUrl] = useState();

    // Dispatch Event
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    // Password Feedback
    const [hide, setHide] = useState(true);
    const [inputType, setInputType] = useState("password");

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

            dispatch(createUser({uid, email}));
            dispatch(uploadUser_Image({uid, file:imageUrl}));
            setFeedback("");
            // navigate("Auth/Register");
        } catch (error) {
            console.log(error);
        }
    }

    const onShowPassword = () => {
        setInputType(hide ? "text" : "password");
        setHide(!hide);
    }

    return (
        < >
            <section className="mb-6">
                <form onSubmit={onRegisterAccount} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium px-4">Email</label>
                        <input 
                            type="email" 
                            placeholder="Register Email" 
                            onChange={(e) => setEmail(e.target.value)}
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium px-4">Password</label>
                        <input 
                            type={inputType}
                            placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium px-4">Confirm Password</label>
                        <input 
                            type={inputType}
                            placeholder="Enter Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex gap-1 mx-4">
                        <input 
                            type="checkbox" 
                            value={!hide} 
                            onChange={onShowPassword}
                            className="size-4"
                        />
                        <p className="leading-none">Show password</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium px-4">File</label>
                        <input 
                            type="file"
                            onChange={(e) => setImageUrl(e.target.files[0])}
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>


                    <button type="submit" className="text-white text-xl font-semibold bg-blue-400 h-14 px-4 py-3 rounded-lg">Create new account</button>
                </form>

                {feedback.trim().length != 0 && <p className="text-xl text-red-400">{feedback}</p>}
            </section>
        </>
    )
}

export default SignupPage;