import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { collection, updateDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ---------------------------------------------------------


// Fetch users (all)(() => name && age)
export const fetchAllUser = createAsyncThunk(
    'users/fetchAllUser',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/users`);
        return response.data;
    }
);

// Fetch personal (data)
export const fetchProfile = createAsyncThunk(
    'users/fetchProfile',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}`);
        return response.data;
    }
);

// Fetch personal (image)
export const fetchUser_Image = createAsyncThunk(
    'users/fetchUser_Image',
    async () => {
        try {
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef);

            const docs = querySnapshot.docs.map((doc) => 
                ({id:doc.id, ...doc.data()})
            );

            return docs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)


// == CREATE/UPLOAD ===================


// Create personal (data)
export const createUser = createAsyncThunk(
    'users/createUser',
    async ({uid, email}) => {
        const body = {
            uid: uid,
            username: email,
            email: email,
        };

        const response = await axios.post(`${VITE_FUTURA_API}/users/signup`, body);
        return response.data;
    }
);

export const createUser_Full = createAsyncThunk(
    'users/createUser_Full',
    async ({uid, username, email, phone, gender, birth}) => {
        const body = {
            uid,
            username,
            email,
            phone,
            gender,
            birth
        };

        const response = await axios.post(`${VITE_FUTURA_API}/users/signup_full`, body);
        return response.data;
    }
);

// Upload personal (image)
export const uploadUser_Image = createAsyncThunk(
    'users/uploadUser_Image',
    async ({uid, file}) => {
        try {
            console.log("uid: ", uid, " /file: ", file);
            let imageUrl = "";

            if (file != null) {
                const imageRef = ref(storage, `users/${file.name}`);
                const response = await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(response.ref);
            }

            const userRef = doc(db, `users/${uid}`);
            await setDoc(userRef, {imageUrl});

            const user = {
                id: uid,
                imageUrl: imageUrl
            };

            console.log("User profile data: ", user);

            return user;
        } catch (error) {
            console.error("Upload Image in user has received an error: ", error);
            throw error;
        }
    }
)


// == UPDATE =========================


//Update personal (data)
export const updateUser = createAsyncThunk(
    'users/updateUser', 
    async ({uid, username, phone, gender, birth}) => {
        const body = {
            username: username,
            phone: phone,
            gender: gender,
            birth: birth
        };

        const response = await axios.put(`${VITE_FUTURA_API}/users/${uid}`, body);
        return response.data;
    }
);


//Update personal (image)
export const updateUser_Image = createAsyncThunk(
    'users/updateUser_Image',
    async ({ uid, newFile }) => {
        try {
            console.log("Receive Update: ", newFile);
            let newImageUrl;

            if (newFile != null) {
                const imageRef = ref(storage, `users/${newFile.name}`);
                const response = await uploadBytes(imageRef, newFile);
                newImageUrl = await getDownloadURL(response.ref);
            }

            const userRef = doc(db, `users/${uid}`);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();

                const updatedData = {
                    ...userData,
                    imageUrl: newImageUrl || userData.imageUrl,
                };

                await updateDoc(userRef, updatedData);

                const updateUser = { id: uid, ...updatedData };
                return updateUser;
            } else {
                throw new Error("User does not exist");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)


// == REMOVE =========================


// Delete user database
export const removeUser = createAsyncThunk(
    'users/removeUser',
    async (uid) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${uid}`);
        return response.data;
    }
);


// -------------------------------------------------

const usersSlice = createSlice({
    name: "usersSlice",
    initialState: {
        users: [],
        personal: {},
        personalImage: {},
        users_loading: true,
        personal_loading: true
    },
    reducers: {
        userCheckout: (state) => {
            state.personal = null;
            state.personal_loading = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch all users =============>
        builder
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.users = action.payload;
                state.users_loading = false;
            })
            .addCase(fetchAllUser.pending, (state) => {
                state.users_loading = true;
            });
        
        // Fetch personal user =============>
        builder
            .addCase(fetchProfile.fulfilled, (state, action) => {
                console.log("He: ", action.payload);
                state.personal = action.payload;
                state.personal_loading = false;
            })
            .addCase(fetchProfile.pending, (state) => {
                state.personal_loading = true;
            })

        builder
            .addCase(uploadUser_Image.fulfilled, (state, action) => {
                console.log("Action from Upload Image: ", action.payload);
                state.personalImage = action.payload;
            })

        // Create User =============>
        builder
            .addCase(createUser.fulfilled, (state, action) => {
                state.personal = action.payload.data;
                state.personal_loading = false;
            })
            .addCase(createUser.pending, (state) => {
                state.personal_loading = true;
            })

        builder
            .addCase(createUser_Full.fulfilled, (state, action) => {
                state.personal = action.payload.data;
                state.personal_loading = false;
            })
            .addCase(createUser_Full.pending, (state) => {
                state.personal_loading = true;
            })

        // Update User =============>
        builder
            .addCase(updateUser.fulfilled, (state, action) => {
                state.personal = action.payload.updatedData;
                state.personal_loading = false;
            })
            .addCase(updateUser.pending, (state) => {
                state.personal_loading = true;
            })

        builder
            .addCase(updateUser_Image.fulfilled, (state, action) => {
                state.personalImage = action.payload;
            })

        // Delete User =============>
        builder
            .addCase(removeUser.fulfilled, (state) => {
                state.personal = null;
                state.personal_loading = true;
            })
        
    },
});


export const { userCheckout }  = usersSlice.actions;

export default usersSlice.reducer;