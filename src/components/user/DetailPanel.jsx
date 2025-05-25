import { useState } from "react";
import { Button } from "../ui";

import { deleteDBUser, updateUserDetail, updateUserPicture } from "../../features/usersSlice";
import { getAuth, deleteUser } from "firebase/auth";
import { useDispatch } from "react-redux";

const ConfirmationModal = ({show, onCancel, onConfirm}) => {
    if (!show) return null;

    return (
        < >
            <div 
                className="fixed inset-0 flex bg-black bg-opacity-35"
                role="dialog"
                arial-modal="true"
            >
                <div className='m-auto px-6 py-4 flex flex-col gap-6 justify-center text-center bg-white border-black border'>
                    <h2>ARE YOU SURE?</h2>
                    <p>You will loss the account forever</p>

                    <hr />

                    <div className="flex gap-4"> 
                        <Button onClick={onConfirm} variant={"secondary_filled"} state={"full"}> 
                            Delete
                        </Button>

                        <Button onClick={onCancel} variant={"primary_outline"} state={"full"}> 
                            Cancel
                        </Button>
                    </div>
                </div>

            </div>
        </>
    )
}

const DetailPanel = ({authUser, dataUser, imageUrl, status}) => {
    const [fileUrl, setFileUrl] = useState(null);
    const [name, setName] = useState(dataUser?.username || "");
    const [phone, setPhone] = useState(dataUser?.phone || "");
    const [gender, setGender] = useState(dataUser?.gender || "");
    const [birthDate, setBirthDate] = useState(dataUser?.birth || "");

    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const auth = getAuth();

    const updateProfile = () => {
        if (name.trim().length == 0 || phone.trim().length == 0 || birthDate.trim().length == 0)
            return;

        dispatch(updateUserDetail({
            uid: authUser.uid,
            username: name,
            phone: phone,
            gender: gender,
            birth: birthDate
        }))

        if (fileUrl)
            dispatch(updateUserPicture({
                uid: authUser.uid,
                newFile: fileUrl
            }));

        setEditMode(false);
    }

    const removeProfile = async () => {
        try {
            await deleteUser(authUser);
            await auth.signOut();
            dispatch(deleteDBUser(authUser));
            // dispatch(resetWishlist());
        } catch (err) {
            console.log("Critical Error by Detail Panel: ", err);
        }
    }

    if (status == "loading" || status == "idle") return (
        < >
            <h3>Profile: Loading</h3>
            <span className="max-w-32 aspect-square skeleton" />
            <span className="h-12 skeleton" />
            <span className="h-12 skeleton" />
            <span className="h-12 skeleton" />
            <span className="h-12 skeleton" />
        </>
    )

    return (
        < >
            <h3>{editMode ? "Edit Profile" : "Profile"}</h3>
            
            {/* PREVIEW MODE */}
            {!editMode &&  
                (<>
                    <img src={imageUrl} className="max-w-32 aspect-square skeleton" />
                    <p className="body2 border border-black px-6 py-4">{name}</p>
                    <p className="body2 border border-black px-6 py-4">{phone}</p>
                    <p className="body2 border border-black px-6 py-4">{gender}</p>
                    <p className="body2 border border-black px-6 py-4">{birthDate.split("T")[0].split("-").join("/")}</p>
                </>)
            }

            {/* FORM MODE */}
            {editMode &&  
                (<>
                    <input 
                        type="file" 
                        onChange={(e) => setFileUrl(e.target.files[0])} 
                    />

                    <input 
                        type="email"
                        value={name}
                        placeholder="Email"
                        onChange={(e) => setName(e.target.value)}
                    />
                    

                    <input 
                        type="tel"
                        value={phone}
                        placeholder="Phone"
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <select 
                        name="gender" 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    
                    <input 
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </>)
            }

            <div className="flex gap-3 w-96 max-sm:w-full">
                {editMode && 
                    <Button 
                        variant={"primary_filled"} 
                        state={"full"}
                        onClick={updateProfile}
                    >
                        Update Profile
                    </Button>
                }

                <Button 
                    variant={`${editMode ? "primary_outline" : "primary_filled"}`} 
                    state={"full"}
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? "Cancel" : "Edit Profile"}
                </Button>

                {!editMode && 
                    <Button 
                        variant={`${editMode ? "secondary_outline" : "secondary_filled"}`} 
                        state={"full"}
                        onClick={() => setShowModal(true)}
                    >
                        Delete Account
                    </Button>
                }
            </div>

            <ConfirmationModal 
                show={showModal} 
                onCancel={() => setShowModal(false)} 
                onConfirm={removeProfile}
            />
        </>
    )
}

export default DetailPanel;