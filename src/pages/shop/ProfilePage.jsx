import { getAuth, deleteUser } from "firebase/auth";
import { AuthContext } from "../../Context/AuthProvider";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext, useMemo } from "react";

import { fetchProfile, updateUser, removeUser, updateUser_Image } from "../../features/usersSlice";

import { fetchOrder, getAllItem } from "../../features/orderedSlice";

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

    const [selectedAddress, setSelectedAddress] = useState();

    const [editMode, setEditMode] = useState(false);
    const [submitMode, setSubmitMode] = useState(false);

    useEffect(() => {
        if (address.length == 0) {
            const uid = currentUser.uid;
            dispatch(fetchAddress(uid));
        }
        
    }, [dispatch])

    const onSubmit_Address = (e) => {
        e.preventDefault();

        //Remember to add algorithm to prevent empty input
        if (address_line1.trim().length == 0 || 
            address_line2.trim().length == 0 ||
            city.trim().length == 0 || 
            region.trim().length == 0 || 
            postal_code.trim().length == 0 
        )
            return;

        if (submitMode) {
            dispatch(createAddress({
                uid: currentUser.uid, 
                address_line1, 
                address_line2, 
                city, 
                region, 
                postal_code
            }));
        }
        
        if (editMode) {
            dispatch(updateAddress({
                uid: currentUser.uid, 
                address_line1, 
                address_line2, 
                city, 
                region, 
                postal_code
            }));
        }
       

        //Remember to clear the form
    }

    const onToggleCreateForm = () => {
        if (!editMode)
            setSubmitMode(!submitMode);
    }

    const onToggleEditForm = (index) => {
        if (submitMode) 
            return;

        if (selectedAddress === index) {
            setEditMode(false);
            setSelectedAddress(null);
        } else {
            setEditMode(true);
            setSelectedAddress(index);
        }
    }

    // const onRemoveAddress = (id) => {
    //     console.log("Hello"); 

    //     dispatch(removeAddress({
    //         uid: currentUser.uid,
    //         address_id: id
    //     }))
    // }

    useEffect(() => {
        if (selectedAddress != null) {
            const data = address.find((data) => data.id == selectedAddress);
            if (data) {
                setAddress_line1(data.address_line1);
                setAddress_line2(data.address_line2);
                setCity(data.city);
                setRegion(data.region);
                setPostalCode(data.postal_code);
            }
        } else {
            setAddress_line1("");
            setAddress_line2("");
            setCity("");
            setRegion("");
            setPostalCode("");
        }
    }, [selectedAddress])

    return (
        < >
            {(!editMode && !submitMode) && <h2>Delivery Address</h2>}
            {editMode && <h2>Add New Address</h2>}
            {submitMode && <h2>Add New Address</h2>}

            {/* {(onSubmit_Address)} */}
            {(editMode || submitMode) &&
                <form className="flex flex-col gap-6">
                    <input 
                        type="text" 
                        placeholder="Address Line 1"
                        value={address_line1 || ""}
                        onChange={(e) => setAddress_line1(e.target.value)} 
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    />

                    <input 
                        type="text"
                        placeholder="Address Line 2"
                        value={address_line2 || ""}
                        onChange={(e) => setAddress_line2(e.target.value)} 
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    />
                    
                    <div className=" flex gap-6">
                        <input 
                            type="text" 
                            placeholder="City"
                            value={city || ""}
                            onChange={(e) => setCity(e.target.value)} 
                            className="flex-1 body2 border border-gray-400 text-gray-500 px-6 py-4"
                        />

                        <input 
                            type="text" 
                            placeholder="State"
                            value={region || ""}
                            onChange={(e) => setRegion(e.target.value)} 
                            className="flex-1 body2 border border-gray-400 text-gray-500 px-6 py-4"
                        />
                    </div>

                    <input 
                        type="text"
                        placeholder="Postal Code"
                        value={postal_code || ""} 
                        onChange={(e) => setPostalCode(e.target.value)} 
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    />
                </form>
            }

            {(submitMode || editMode) && (
                <div className="flex gap-3 w-[50%]">
                    <button onClick={onSubmit_Address} className="flex-1 bg-black text-white py-3 px-6">
                        Confirm New Address
                    </button>

                    <button 
                        onClick={() => {
                            setSubmitMode(false);
                            setEditMode(false);
                        }} 
                        className="flex-1 border border-black py-3 px-6"
                    >
                        Cancel Create
                    </button>
                </div>
            )}

            {(!submitMode && !editMode) && 
                <div className="flex flex-col gap-6">
                    {(!address_loading && address.length != 0) && (
                        address.map((data, index) => (
                            <div className="p-4 flex justify-between border border-black" key={data.uid}>
                                <div className="flex flex-col gap-4">
                                    <p className="subtitle2">Address {index + 1}</p>

                                    <p className="body2 flex flex-col gap-1">
                                        {data.address_line1} {data.address_line2 != null && data.address_line2}
                                        <span>{data.city}, {data.region} {data.postal_code}</span>
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <button 
                                        onClick={() => onToggleEditForm(data.id)} 
                                        className="flex-1 bg-black text-white px-4 py-2"
                                    >
                                        Edit
                                    </button>

                                    <button className="flex-1 border border-black px-4 py-2">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    
                    <button onClick={() => setSubmitMode(true)} className="bg-black text-white py-3 px-6">
                        Create Address
                    </button>
                </div>
            }
        </>
    )
}

const ConfirmationModal = ({show, onHide, onRemove}) => {

    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 flex bg-gray-200 bg-opacity-35"
            role="dialog"
            arial-modal="true"
        >
            <div className='size-80 m-auto flex flex-col gap-4 justify-center text-center border-black border p-4 bg-white'>
                <h2>ARE YOU SURE?</h2>
                <p>You will loss the account forever</p>
                <hr />

                <div className="flex gap-4">
                    <button onClick={onRemove} className="flex-1 border border-black py-2 bg-red-500 text-white">
                        DELETE
                    </button>
                    <button onClick={onHide} className="flex-1 border border-black py-2 ">
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    )
}

const UserProfile = ({info, imageUrl}) => {
    const { currentUser } = useContext(AuthContext) || null;

    const [fileUrl, setFileUrl] = useState();
    const [username, setUsername] = useState(info.username);
    const [phone, setPhone] = useState(info?.phone);
    const [gender, setGender] = useState(info?.gender);
    const [birth, setBirth] = useState(info?.birth);
    const [editMode, setEditMode] = useState(false);

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const auth = getAuth();

    const onUpdate_Profile = () => {
        dispatch(updateUser({
            uid: currentUser.uid, 
            username, 
            phone, 
            gender, 
            birth
        }));

        console.log("Execute update image");
        dispatch(updateUser_Image({uid: currentUser.uid, newFile: fileUrl}));
    }

    const onRemove_Profile = async () => {
        try {
            await deleteUser(currentUser);
            await auth.signOut();
            await dispatch(removeUser(currentUser.uid));
        } catch (error) {
            console.log("Report: ", error);
        }
    }

    const onToggleEdit = () => setEditMode(!editMode);

    return (
        <>
            <h3>{editMode ? "Edit Profile" : "Profile"}</h3>

            {editMode 
                ? <input 
                    type="file" 
                    onChange={(e) => setFileUrl(e.target.files[0])} 
                    />
                : <img src={imageUrl} className="max-w-32 aspect-square " />
            }

            {editMode   
                ?   <input 
                        type="email"
                        value={username}
                        placeholder="Example: Futura023"
                        onChange={(e) => setUsername(e.target.value)}
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    />
                :   <p className="body2 border border-black px-6 py-4">
                        {username}
                    </p>
            }

            {editMode   
                ?   <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    />
                :   <p className="body2 border border-black px-6 py-4">
                        {phone}
                    </p>
            }

            {editMode   
                ? (
                    <select 
                        name="gender" 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select> )
                : <p className="body2 border border-black px-6 py-4">{gender}</p>
            }

            {editMode   
                ?   <input 
                        type="date"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                        className="body2 border border-gray-400 text-gray-500 px-6 py-4"
                    />
                : <p className="body2 border border-black px-6 py-4">{birth?.split("T")[0].split("-").join("/")}</p>
            }

            <div className="flex gap-3 w-96">
                {editMode && 
                    <button onClick={onUpdate_Profile} className="flex-1 bg-black text-white py-3 px-6">
                        UPDATE PROFILE
                    </button>
                }

                <button onClick={onToggleEdit} className={`flex-1 py-3 px-6 ${editMode ? "border border-black" : "bg-black text-white"}`}>
                    {editMode ? "Cancel" : "Edit Profile"}
                </button>

                {!editMode && 
                    <button onClick={() => setOpen(true)} className="flex-1 border border-red-500 text-red-500 py-3 px-6">
                        Delete Account
                    </button>
                }
            </div>

            <ConfirmationModal show={open} onHide={() => setOpen(false)} onRemove={() => onRemove_Profile()}/>
        </>
    )
}

// {orderId, address}
const OrderCard = () => {
    const [shown, setShown] = useState(false);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-6 px-8 py-7 border border-gray-500">
                <div className="flex gap-6">
                    <img className="w-32 aspect-square bg-slate-400"/>

                    <div className="flex-1 flex flex-col gap-2 my-auto">
                        <p className="subtitle2">Brown Cover Hat</p>
                        <p className="body2">Expected by 30 May 2025</p>
                        <p className="body2 w-[32ch]">Shipping to 28 Jalan Sultan Ismail Kuala Lumpur, Wilayah Persekutuan 50250</p>
                    </div>
                    <h3 className="my-auto">RM95</h3>
                </div>

                {shown &&
                    <div className="flex flex-col gap-5">
                        <p className="body1 flex justify-between text-gray-400">
                            Qty <span className="subtitle2 text-black">2</span>
                        </p>
                        <p className="body1 flex justify-between text-gray-400">
                            Size <span className="subtitle2 text-black">Large</span>
                        </p>
                        <p className="body1 flex justify-between text-gray-400">
                            Color <span className="subtitle2 text-black">Brown</span>
                        </p>
                    </div>
                }
            </div>

            <button 
                onClick={() => setShown(!shown)} 
                className="bg-white border-x border-b border-gray-500 py-3 flex justify-center"
            >
                {shown ? "View more" : "Hide detail"}
            </button>
        </div>
    )
}

const OrderPanel = () => {
    const { order, orderItem } = useSelector((state) => state.orders);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();

    useEffect(() => {
        if (order.length == 0)
            dispatch(fetchOrder(currentUser.uid));

        if (orderItem.length == 0)
            dispatch(getAllItem(currentUser.uid));
    }, [dispatch, currentUser.uid, order.length])

    const newestOrder = useMemo(() => {
        return order.slice().sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    }, [order]);

    const sortedPending = useMemo(() => {
        return newestOrder.slice().filter((info) => info.order_status == "Prepping");
    }, [newestOrder])

    const sortedDelivered = useMemo(() => {
        return newestOrder.slice().filter((info) => info.order_status == "Delivered");
    }, [newestOrder])

    useEffect(() => {
        console.log("Item: ", orderItem)
    }, [orderItem])

    const [state, setState] = useState("Pending");

    return (
        < >
            <h3>Order Status</h3>

            <nav className="flex">
                <button 
                    onClick={() => setState("Pending")} 
                    className={`flex-1 body2 pb-4 border-b-2 ${state == "Pending" ? " border-black text-black" : "border-gray-400 text-gray-400"}`}
                >Pending {state == "Pending" && `(${sortedPending.length})`}</button>

                <button 
                    onClick={() => setState("OutDelivery")} 
                    className={`flex-1 body2 pb-4 border-b-2 ${state == "OutDelivery" ? " border-black text-black" : "border-gray-400 text-gray-400"}`}
                >Out of Delivery {state == "OutDelivery" && "(0)"}</button>

                <button 
                    onClick={() => setState("Delivered")} 
                    className={`flex-1 body2 pb-4 border-b-2 ${state == "Delivered" ? " border-black text-black" : "border-gray-400 text-gray-400"}`}
                >Delivered {state == "Delivered" && `(${sortedDelivered.length})`}</button>
            </nav>

            {state == "Pending" && sortedPending.map((data, index) => 
                <div key={index} className="flex flex-col gap-6">
                    <p className="subtitle2">Order #{data.id} | Placed on {data.order_date.split("T")[0]}</p>
                    {orderItem.slice().filter((prev) => prev.id == data.id).map((data, index) => 
                        <OrderCard key={index} />
                    )}
                </div>
            )}

            {state == "Delivered" && sortedDelivered.map((data, index) => 
                <div key={index} className="flex flex-col gap-6">
                    <p className="subtitle2">Order #{data.id} | Placed on {data.order_date.split("T")[0]}</p>
                    {orderItem.slice().filter((prev) => prev.id == data.id).map((data, index) => 
                        <OrderCard key={index} />
                    )}
                </div>
            )}
        </>
    )
}

// ====================>

const ProfilePage = () => {
    const { personal, personal_loading, personalImage  } = useSelector((state) => state.users);
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
        < >
            <section className="flex gap-20 max-lg:flex-col max-lg:gap-10">
                <aside className="flex-[0.4] flex flex-col gap-4 max-lg:flex-auto">
                    <h2>Settings</h2>

                    <div className="flex flex-col gap-2 max-lg:flex-row">
                        <button 
                            onClick={() => setMode("PROFILE")} 
                            className={`
                                subtitle2 py-3 px-4 text-start 
                                ${mode == "PROFILE" ? "bg-black text-white" : "border-b border-black"}
                            `}
                        >
                            Profile
                        </button>

                        <button 
                            onClick={() => setMode("ADDRESS")} 
                            className={`
                                subtitle2 py-3 px-4 text-start 
                                ${mode == "ADDRESS" ? "bg-black text-white" : "border-b border-black"}
                            `}
                        >
                            Delivery Address
                        </button>

                        <button 
                            onClick={() => setMode("ORDER")} 
                            className={`
                                subtitle2 py-3 px-4 text-start 
                                ${mode == "ORDER" ? "bg-black text-white" : "border-b border-black"}
                            `}
                        >
                            Order Status
                        </button>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col gap-6">
                    {(!personal_loading && mode == "PROFILE") && <UserProfile info={personal} imageUrl={personalImage?.imageUrl}/>}
                    {(mode == "ADDRESS") && <Address />}
                    {(mode == "ORDER") && <OrderPanel />}
                </div>
            </section>
            
        </>
    )
}


export default ProfilePage;