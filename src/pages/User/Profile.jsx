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
        <>
            <h2>Payment</h2>
            
            <div className="flex flex-col gap-4">
                <form className="grid grid-cols-2 gap-4">
                    <label>Payment Type:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setPayment_type(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>Provider:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setProvider(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>Account Number:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setAccount_number(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>Expiry Date:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setExpiry_date(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />
                </form>

                <button onClick={onSubmit_Payment} className="bg-gray-300 py-4 rounded-lg cursor-pointer">
                    Create Payment
                </button>
            </div>

            <hr className="border-black"/>

            <div className="flex flex-wrap gap-2">
                {(!payment_loading && payment.length != 0) && (
                    payment.map((data, index) => (
                        <div className="bg-blue-200 p-2 flex flex-col border border-black transition-transform hover:translate-x-7" key={data.uid}>
                            <h2>#{index + 1}</h2>

                            <hr className="border-black my-4" />

                            <p>payment_type: {data.payment_type}</p>
                            <p>provider: {data.provider}</p>
                            <p>account_number: {data.account_number}</p>
                            <p>expiry_date: {data.expiry_date}</p>

                            <hr className="border-black my-4" />

                            <button className="border border-black py-2 my-1">Edit Payment</button>
                            <button className="border border-black py-2">Remove Payment</button>
                        </div>
                    ))
                )}
            </div>
            
            {(!payment_loading && payment.length == 0) && (
                <h2>No payment method is created</h2>
            )}
        </>
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
        < >
            <h2>Address</h2>
            
            <div className="flex flex-col gap-4">
                <form className="grid grid-cols-2 gap-4">
                    <label>Address line 1:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setAddress_line1(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>Address line 2:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setAddress_line2(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>City:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setCity(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>Region:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setRegion(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />

                    <label>Postal Code:</label>
                    <input 
                        type="text" 
                        onChange={(e) => setPostalCode(e.target.value)} 
                        className="px-4 py-1 border border-black rounded-lg"
                    />
                </form>

                <button onClick={onSubmit_Address} className="bg-gray-300 py-4 rounded-lg cursor-pointer">
                    Create Address
                </button>
            </div>

            <hr className="border-black"/>

            <div className="flex flex-wrap gap-2">
                {(!address_loading && address.length != 0) && (
                    address.map((data, index) => (
                        <div className="bg-blue-200 p-2 flex flex-col border border-black transition-transform hover:translate-x-7" key={data.uid}>
                            <h2>#{index + 1}</h2>

                            <hr className="border-black my-4" />

                            <p>ADDRESS LINE 1: {data.address_line1}</p>
                            {data.address_line2 != null && <p>Address line 2: {data.address_line2}</p>}
                            <p>CITY: {data.city}</p>
                            <p>REGION: {data.region}</p>
                            <p>POSTAL CODE: {data.postal_code}</p>

                            <hr className="border-black my-4" />

                            <button className="border border-black py-2 my-1">Edit Address</button>
                            <button className="border border-black py-2">Remove Address</button>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

const UserProfile = ({info}) => {
    const [username, setUsername] = useState(info.username);
    const [phone, setPhone] = useState(info.phone);
    const [gender, setGender] = useState(info.gender);
    const [birth, setBirth] = useState(info.birth);

    const [editMode, setEditMode] = useState(false);

    const onToggleEdit = () => setEditMode(!editMode);

    return (
        <> 
            <div className="flex gap-4 items-center">
                <img className="bg-green-400 aspect-square max-w-32" />

                <hr className="h-full border-r border-black" />

                <div className="flex-1 grid grid-cols-2 items-center">
                    <label>USERNAME:</label>
                    {editMode   
                        ? <input 
                            type="email"
                            value={info.username}
                            placeholder="Example: Futura023"
                            onChange={(e) => setUsername(e.target.value)}/>
                        : <p>{username}</p>
                    }

                    <hr className="col-span-2 my-1 border-gray-300" />

                    <label>PHONE:</label>
                    {editMode   
                        ? <input 
                            type="tel"
                            value={info.phone}
                            onChange={(e) => setPhone(e.target.value)}/>
                        : <p>{phone}</p>
                    }

                    <hr className="col-span-2 my-1 border-gray-300" />

                    <label>GENDER:</label>
                    {editMode   
                        ? (
                            <select 
                                name="gender" 
                                value={info.gender} 
                                placeholder={(e) => setGender(e.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select> )
                        : <p>{gender}</p>
                    }

                    <hr className="col-span-2 my-1 border-gray-300" />

                    <label>Birth:</label>
                    {editMode   
                        ? <input 
                            type="date"
                            value={info.birth.split("T")[0]}
                            onChange={(e) => setBirth(e.target.value)}/>
                        : <p>{birth.split("T")[0].split("-").join("/")}</p>
                    }
                </div>
            </div>

            <button onClick={onToggleEdit} className="border border-black py-2">
                {editMode ? "CANCEL EDIT" : "EDIT PROFILE"}
            </button>
            {editMode && <button className="border border-black py-2">UPDATE PROFILE</button>}

            <hr className="border-black" />

            <button className="text-lg font-medium uppercase py-2 bg-red-700 text-white transition-all hover:bg-red-900 hover:rounded-lg">
                Delete Account
            </button>
        </>
    )
}

const Profile = () => {
    const { personal, personal_loading  } = useSelector((state) => state.users);
    const [mode, setMode] = useState("PROFILE");
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();

    useEffect(() => {
        if (personal.length === 0)
            dispatch(fetchProfile(currentUser.uid));
    }, [dispatch, personal])

    // const updateProfile = (e) => {
    //     e.preventDefault;
    //     const id = 0;

    //     dispatch(updateUser({id, username, phone, gender, birth}));
    // }

    return (
        <main className="flex flex-col my-4">
            <section>
                <h1 className="mb-8">PROFILE SETTINGS</h1>
            </section>

            <section className="flex gap-6">
                <aside className="flex-[0.3] flex flex-col gap-2">
                    <button onClick={() => setMode("PROFILE")} className="text-start p-1 text-xl border border-black hover:px-4 hover:scale-110 transition-all hover:bg-black hover:text-white">Profile</button>
                    <button onClick={() => setMode("ADDRESS")} className="text-start p-1 text-xl border border-black hover:px-4 hover:scale-110 transition-all hover:bg-black hover:text-white">Address book</button>
                    <button onClick={() => setMode("PAYMENT")} className="text-start p-1 text-xl border border-black hover:px-4 hover:scale-110 transition-all hover:bg-black hover:text-white">Payment book</button>
                </aside>

                <div className="flex-1 flex flex-col gap-4 p-4 border border-gray-300">
                    {personal_loading && <h1>Loading User</h1>}
                    {(!personal_loading && mode == "PROFILE") && <UserProfile info={personal}/>}
                    {(mode == "ADDRESS") && <Address />}
                    {(mode == "PAYMENT") && <Wallet />}
                </div>
            </section>
            
        </main>
    )
}

export default Profile;