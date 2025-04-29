import { getAuth } from "firebase/auth";
import { AuthContext } from "../../Context/AuthProvider";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext } from "react";

import { fetchProfile, updateUser, deleteUser} from "../../features/usersSlice";

import { createPayment, fetchPayment, updatePayment, deletePayment } from "../../features/paymentSlice";
const Wallet = () => {
    const { payment, payment_loading } = useSelector((state) => state.payments);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();

    const [payment_type, setPayment_type] = useState("");
    const [provider, setProvider] = useState("");
    const [account_number, setAccount_number] = useState("");
    const [expiry_date, setExpiry_date] = useState(""); 
    const [is_default, setIs_default] = useState("");

    useEffect(() => {
        if (payment.length == 0) {
            const uid = currentUser.uid;
            dispatch(fetchPayment(uid));
        }
        
    }, [dispatch])

    const onSubmit_Payment = (e) => {
        e.preventDefault();

        console.log("Submit Payment");
        //Remember to add algorithm to prevent empty input

        const uid = currentUser.uid;
        dispatch(createPayment({uid, payment_type, provider, account_number, expiry_date, is_default}));

        //Remember to clear the form
    }

    return (
        <section className="border-2 border-black">
            <h2>Payment</h2>
            {payment_loading && <p>Loading</p>}
            {(!payment_loading && payment.length != 0) && (
                payment.map((data, index) => (
                    <section className="mb-4" key={data.uid}>
                        {console.log(payment)}
                        <div className="bg-black text-white">
                            <h3>Index: {index + 1}</h3>
                            <p>payment_type: {data.payment_type}</p>
                            <p>provider: {data.provider}</p>
                            <p>account_number: {data.account_number}</p>
                            <p>expiry_date: {data.expiry_date}</p>
                            <p>is_default: {data.is_default}</p>
                        </div>
                    </section>
                ))
            )}
            {(!payment_loading && payment.length == 0) && (
                <p>No payment method is created</p>
            )}

            {/* Create */}
            <section>
                <form className="flex flex-col gap-6 text-sm">
                    <div className="flex flex-col gap-2">
                        <label>Payment Type:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setPayment_type(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Provider:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setProvider(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Account Number:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setAccount_number(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Expiry Date:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setExpiry_date(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Is Default:</label>
                        <input 
                            type="checkbox" 
                            onChange={(e) => setIs_default(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>
                </form>

                <button onClick={onSubmit_Payment} className="bg-gray-300 cursor-pointer">
                    Create Payment
                </button>
            </section>
        </section>
    )
}

import { createAddress, fetchAddress, updateAddress, removeAddress } from "../../features/addressSlice";
const Address = () => {
    const { address, address_loading } = useSelector((state) => state.address);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();

    const [address_line1, setAddress_line1] = useState("");
    const [address_line2, setAddress_line2] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState(""); 
    const [postal_code, setPostalCode] = useState("");

    useEffect(() => {
        if (address.length == 0) {
            const uid = currentUser.uid;
            dispatch(fetchAddress(uid));
        }
        
    }, [dispatch])

    const onSubmit_Address = (e) => {
        e.preventDefault();

        //Remember to add algorithm to prevent empty input

        const uid = currentUser.uid;
        dispatch(createAddress({uid, address_line1, address_line2, city, region, postal_code}));

        //Remember to clear the form
    }

    return (
        <section className="border-2 border-black">
            <h2>Address</h2>
            {address_loading && <p>Loading</p>}
            {(!address_loading && address.length != 0) && (
                address.map((data, index) => (
                    <section className="mb-4" key={data.uid}>
                        <div className="bg-black text-white">
                            <h3>Index: {index + 1}</h3>
                            <p>address line 1: {data.address_line1}</p>
                            <p>address line 2: {data.address_line2}</p>
                            <p>city: {data.city}</p>
                            <p>Region: {data.region}</p>
                            <p>Postal Code: {data.postal_code}</p>
                        </div>
                    </section>
                ))
            )}

            {/* Create */}
            <section>
                <form className="flex flex-col gap-6 text-sm">
                    <div className="flex flex-col gap-2">
                        <label>Address line 1:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setAddress_line1(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Address line 2:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setAddress_line2(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>City:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setCity(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Region:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setRegion(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Postal Code:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setPostalCode(e.target.value)} 
                            className="min-h-14 px-4 py-2 border-2 border-black rounded-lg"
                        />
                    </div>
                </form>

                <button onClick={onSubmit_Address} className="bg-gray-300 cursor-pointer">
                    Create Address
                </button>
            </section>
        </section>
    )
}


const Profile = () => {
    const { personal, personal_loading  } = useSelector((state) => state.users);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();

    const [username, setUsername] = useState();
    const [phone, setPhone] = useState();
    const [gender, setGender] = useState();
    const [birth, setBirth] = useState();

    useEffect(() => {
        const uid = currentUser.uid;

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
        <main className="flex flex-col gap-4">
            {personal_loading && <p>is loading</p>}
            <section className="border-2 border-black">
                {!personal_loading && (<> 
                    {/* <img src={`${true}`} /> */}
                    <h3>{personal.username}</h3>
                    <p>{personal.email}</p>
                    <p>{personal.phone}</p>
                    <p>{personal.gender}</p>
                    <p>{personal.date}</p>
                    
                    {/* <h2>Edit Format</h2>
                    <form onSubmit={updateProfile}>
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
                    </form> */}
                </>)}
            </section>

            {/* Address */}
            <Address />

            <Wallet />
        </main>
    )
}

export default Profile;