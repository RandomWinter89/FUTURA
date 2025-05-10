import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";

import { fetchProfile } from "../../features/usersSlice";
import { useState } from "react";

import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

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
            const uid = feedback.user.uid;
            console.log("UID: ", uid);
            dispatch(fetchProfile(uid));
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
            <section>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Password</label>
                        <input 
                            type={inputType} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <section className="flex gap-4">
                        <input type="checkbox" value={!hide} onChange={onShowPassword}/>
                        <p>Show password</p>
                    </section>

                    <button type="submit" className="text-white text-xl font-semibold bg-blue-400 h-14 px-4 py-3 rounded-lg">Login</button>
                    {error.trim().length != 0 && <p className="text-xl text-red-400">{error}</p>}
                </form>

                <p>Forget password? <a className="text-red-400">Reset Password</a></p>
                <p>Don't have account <a className="text-blue-300" onClick={onNavigate_Signup}>Signup</a></p>
            </section>
        </>
    )
}

export default LoginPage;