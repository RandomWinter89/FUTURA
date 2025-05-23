import { createAddress, updateAddress } from "../../features/addressSlice";

import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { Button } from "../ui";

const AddressCard = ({data, index, requestEdit, skeleton=false}) => {

    if (skeleton) return (
        < >
            <div className="h-32 p-4 flex border border-black">
                <div className="flex-1 flex flex-col gap-4 ">
                    <span className="flex-1 w-[32ch] skeleton" />

                    <div className="flex-1 flex flex-col gap-1">
                        <span className="flex-1 w-[70%] skeleton" />
                        <span className="flex-1 w-[70%] skeleton" />

                        <div className="flex-1 w-[25%] flex gap-2">
                            <span className="flex-1 w-16 skeleton" />
                            <span className="flex-1 w-16 skeleton" />
                            <span className="flex-1 w-16 skeleton" />
                        </div>
                    </div>
                </div>

                <span className="w-32 h-16 mr-auto my-auto skeleton" />
            </div>
        </>
    )

    return (
        < >
            <div className="p-4 flex justify-between border border-black" key={data.id}>
                <div className="flex flex-col gap-4">
                    <p className="subtitle2">Address {index + 1}</p>

                    <p className="body2 flex flex-col gap-1">
                        {data.address_line1} {data.address_line2 != null && data.address_line2}
                        <span>{data.city}, {data.region} {data.postal_code}</span>
                    </p>
                </div>

                <Button size={"sm"} state={"fit"} onClick={requestEdit}>
                    Edit
                </Button> 
            </div>
        </>
    )
}

const AddressPanel = ({authUser, userAddress, loading}) => {
    const [address_line1, setAddress_line1] = useState("");
    const [address_line2, setAddress_line2] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState(""); 
    const [postal_code, setPostalCode] = useState("");

    const [selectedAddress, setSelectedAddress] = useState();

    const [editMode, setEditMode] = useState(false);
    const [submitMode, setSubmitMode] = useState(false);

    const dispatch = useDispatch();

    const submitAddress = (e) => {
        e.preventDefault();

        if (address_line1.trim().length == 0 || address_line2.trim().length == 0 ||
            city.trim().length == 0 || region.trim().length == 0 || 
            postal_code.trim().length == 0 
        )
            return;

        if (submitMode) {
            dispatch(createAddress({
                uid: authUser.uid, 
                address_line1, 
                address_line2, 
                city, 
                region, 
                postal_code
            }));
        }
        
        // REQUIRE ID
        if (editMode) {
            dispatch(updateAddress({
                uid: authUser.uid,
                address_id: selectedAddress, 
                address_line1, 
                address_line2, 
                city, 
                region, 
                postal_code
            }));
        }

        setAddress_line1("");
        setAddress_line2("");
        setCity("");
        setRegion("");
        setPostalCode("");

        setEditMode(false);
        setSubmitMode(false);
    }

    const toggleCreateMode = () => {
        if (!editMode)
            setSubmitMode(!submitMode);
    }

    const toggleEditMode = (addrID) => {
        if (submitMode)
            return;

        setEditMode(true);
        setSelectedAddress(addrID);
    }

    useEffect(() => {
        if (selectedAddress != null) {
            const data = userAddress.find((data) => data.id == selectedAddress);
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
    }, [userAddress, selectedAddress])

    if (loading) return (
        < >
            <h2>Address: Loading</h2>
            <div className="flex flex-col gap-6">
                <AddressCard skeleton={true} />
                <AddressCard skeleton={true} />
            </div>
        </>
    )
    
    return (
        < >
            {(!editMode && !submitMode) && <h2>Delivery Address</h2>}
            {submitMode && <h2>Add New Address</h2>}
            {editMode && <h2>Edit Address</h2>}
            
            {(editMode || submitMode) && (
                <form className="flex flex-col gap-6">
                    <input 
                        type="text" 
                        placeholder="Address Line 1"
                        value={address_line1 || ""}
                        onChange={(e) => setAddress_line1(e.target.value)} 
                    />

                    <input 
                        type="text"
                        placeholder="Address Line 2"
                        value={address_line2 || ""}
                        onChange={(e) => setAddress_line2(e.target.value)} 
                    />
                    
                    <div className="flex-1 flex gap-2">
                        <input 
                            type="text" 
                            placeholder="City"
                            value={city || ""}
                            className="flex-1  min-w-0"
                            onChange={(e) => setCity(e.target.value)} 
                        />

                        <input 
                            type="text" 
                            placeholder="State"
                            value={region || ""}
                            className="flex-1 min-w-0"
                            onChange={(e) => setRegion(e.target.value)} 
                        />
                    </div>

                    <input 
                        type="text"
                        placeholder="Postal Code"
                        value={postal_code || ""} 
                        onChange={(e) => setPostalCode(e.target.value)} 
                    />
                </form>
            )}

            {(editMode || submitMode) && (
                <div className="flex gap-3 w-[50%] max-md:w-[80%] max-sm:w-full">
                    <Button onClick={submitAddress}>
                        Confirm
                    </Button>

                    <Button onClick={() => {setSubmitMode(false); setEditMode(false); setSelectedAddress(null) }}>
                        Cancel
                    </Button>
                </div>
            )}

            {(!editMode && !submitMode) && 
                <div className="flex flex-col gap-6">
                    {(userAddress.length != 0)
                        ?   (userAddress.map((data, index) => 
                                <AddressCard 
                                    key={index}
                                    data={data} 
                                    index={index} 
                                    requestEdit={() => toggleEditMode(data.id)} 
                                />)
                            )
                        :   (<p>NO ADDRESS</p>)
                    }

                    <Button state={"fit"} onClick={toggleCreateMode}>
                        Create Address
                    </Button>
                </div>
            }
        </>
    )
}

export default AddressPanel;