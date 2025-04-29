import { getAuth } from "firebase/auth";
import { AuthContext } from "../../Context/AuthProvider";


import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext } from "react";

import { fetchProfile, updateUser, deleteUser} from "../../features/usersSlice";
import { createAddress, fetchAddress, updateAddress, removeAddress } from "../../features/addressSlice";

const Profile = () => {
    const { personal, personal_loading  } = useSelector((state) => state.users);
    const { address, address_loading } = useSelector((state) => state.address);
    const dispatch = useDispatch();

    const [username, setUsername] = useState();
    const [phone, setPhone] = useState();
    const [gender, setGender] = useState();
    const [birth, setBirth] = useState();

    useEffect(() => {
        const uid = 0;

        if (personal.length === 0)
            dispatch(fetchProfile(uid));

        if (personal.length !== 0) {
            setUsername(personal.username);
            setPhone(personal.phone);
            setGender(personal.gender);
            setBirth(personal.birth);
        }

    }, [dispatch, personal])

    const updateProfile = (e) => {
        e.preventDefault;
        const id = 0;

        dispatch(updateUser({id, username, phone, gender, birth}));
    }

    return (
        < >
            <img src={`${true}`} />
            <h3>{personal.username}</h3>
            <p>{personal.email}</p>
            <p>{personal.phone}</p>
            <p>{personal.gender}</p>
            <p>{personal.date}</p>
            
            <h2>Edit Format</h2>
            <form>
                <label>Username</label>
                <input type="email" placeholder="Example: Futura023"/>

                <label>Birth Date</label>
                <input type="date" value={birth}/>

                <label>Gender</label>
                <select 
                    name="gender" 
                    value={gender} 
                    placeholder={(e) => setGender(e.value)}
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label>Phone Number</label>
                <input type="tel" value={phone}/>

                <button type="submit">Update</button>
            </form>

            <h2>Address</h2>
            

            {/* Address */}
        </>
    )
}

export default Profile;