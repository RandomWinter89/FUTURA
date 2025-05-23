import { AuthContext } from "../../Context/AuthProvider";

import { createUserProfile, uploadUserPicture } from "../../features/usersSlice";
import { useState, useContext } from "react";
import { useDispatch } from "react-redux";

import AuthShowcase from "../../assets/AuthShowcase.png";
import { Button } from "../../components/ui";

const RegisterPage = () => {
    const { currentUser } = useContext(AuthContext) || null;
    const [username, setUsername] = useState("");
    const [email] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("Male");
    const [birth, setBirth] = useState("");
    const [imageUrl, setImageUrl] = useState();
    
    const dispatch = useDispatch();

    // Feedback Error
    const [feedback, setFeedback] = useState("");

    const onSubmit_PersonalInfo = (e) => {
        e.preventDefault();

        if (username.trim().length === 0 || phone.trim().length === 0 || birth.trim().length === 0)
            return setFeedback("Please fill-up the empty form");

        setFeedback("");
        dispatch(createUserProfile({
            uid: currentUser.uid, 
            username, 
            email, 
            phone, 
            gender, 
            birth
        })).then(() => {
            dispatch(uploadUserPicture({uid: currentUser.uid, file:imageUrl}));
        })
    }

    return (
        < >
            
            <div className="flex-1 flex flex-col justify-center items-center max-md:px-10">
                <div className="flex flex-col gap-2 mb-8 text-center">
                    <h1>We don't have your data info!</h1>
                    <p>Please re-register or create your detail</p>
                </div>

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

                        <div className="flex flex-col gap-2">
                            <label className="font-medium px-4">File</label>
                            <input 
                                type="file"
                                onChange={(e) => setImageUrl(e.target.files[0])}
                                className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                            />
                        </div>
                    </div>
                    

                    <Button type="submit" >
                        Confirm Update
                    </Button>

                    {feedback.trim().length != 0 && <p className="text-xl text-red-400">{feedback}</p>}
                </form>
            </div>

            <img src={AuthShowcase} className="flex-[0.5] object-cover max-md:hidden" />
        </>
    )
}

export default RegisterPage;