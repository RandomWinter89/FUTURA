import { AuthContext } from "../../Context/AuthProvider";

import { fetchProfile, updateUser } from "../../features/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useContext, useEffect} from "react";

import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("Male");
    const [birth, setBirth] = useState("");
    
    const { currentUser } = useContext(AuthContext) || null;

    const { personal } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Feedback Error
    const [feedback, setFeedback] = useState("");

    const onSubmit_PersonalInfo = (e) => {
        e.preventDefault();

        // const phonePattern =  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (username.trim().length === 0 || phone.trim().length === 0 || birth.trim().length === 0)
            return setFeedback("Please fill-up the empty form");

        setFeedback("");
        const uid = currentUser.uid;
        dispatch(updateUser({uid, username, phone, gender, birth}));
        navigate("/Homepage");
    }

    useEffect(() => {
        const uid = currentUser.uid;
        if (personal.length === 0)
            dispatch(fetchProfile(uid));
    }, [dispatch])

    return (
        < >
            <h2>Create Profile Form</h2>
            <section className="bg-green-200">
                <form onSubmit={onSubmit_PersonalInfo} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label>Username</label>
                        <input 
                            type="text" 
                            onChange={(e) => setUsername(e.target.value)}
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-[0.4] flex flex-col gap-2">
                            <label>Birth Date</label>
                            <input 
                                type="date"
                                onChange={(e) => setBirth(e.target.value)}
                                className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                            />
                        </div>

                        <div className="flex-[0.2] flex flex-col gap-2">
                            <label>Gender</label>
                            <select 
                                name="gender" 
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                onChange={(e) => setPhone(e.target.value)}
                                className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <input type="file" className="flex-1 min-h-14 px-4 py-2 border-2 border-black rounded-lg"/>
                        <img className="flex-[0.25] bg-slate-500 aspect-square" />
                    </div>
                    

                    <button type="submit" className="text-white text-xl font-semibold bg-blue-400 h-14 px-4 py-3 rounded-lg">Update</button>
                </form>

                {feedback.trim().length != 0 && <p className="text-xl text-red-400">{feedback}</p>}
            </section>
        </>
    )
}

export default RegisterForm;