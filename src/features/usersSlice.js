import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ---------------------------------------------------------

// == CREATE SECTION ======================>


// Create user (signup flow)
export const registerUser = createAsyncThunk(
    'users/registerUser',
    async ({uid, email}) => {
        const body = {
            uid: uid,
            username: email,
            email: email,
        };

        const response = await axios.post(`${VITE_FUTURA_API}/users/authSignup`, body);
        return response.data;
    }
);

// Create user (auth flow)
export const createUserProfile = createAsyncThunk(
    'users/createUserProfile',
    async ({uid, username, email, phone, gender, birth}) => {
        const body = {
            uid,
            username,
            email,
            phone,
            gender,
            birth
        };

        const response = await axios.post(`${VITE_FUTURA_API}/users/dbSignup`, body);
        return response.data;
    }
);

// Create profile picture (firebase file)
export const uploadUserPicture = createAsyncThunk(
    'users/uploadUserPicture',
    async ({uid, file}) => {
        try {
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

            return user;
        } catch (error) {
            console.error("Upload Image in user has received an error: ", error);
            throw error;
        }
    }
)


// == READ SECTION ======================>


// Read Profile
export const readCurrentUserProfile = createAsyncThunk(
    'users/readCurrentUserProfile',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/readUser`);
        return response.data;
    }
);

// Read Profile's Image
export const readCurrentUserPicture = createAsyncThunk(
    'users/readCurrentUserPicture',
    async (id) => {
        try {
            const usersRef = doc(db, "users", id);
            const querySnapshot = await getDoc(usersRef);

            if (querySnapshot.exists()) {
                const userData = querySnapshot.data();
                return {
                    id: querySnapshot.id,
                    imageUrl: userData.imageUrl, // Adjust based on your field name
                };
            } else {
                throw new Error("User not found");
            }
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)


// == UPDATE ======================>


//Update user's detail
export const updateUserDetail = createAsyncThunk(
    'users/updateUserDetail', 
    async ({uid, username, phone, gender, birth}) => {
        const body = {
            username: username,
            phone: phone,
            gender: gender,
            birth: birth
        };

        const response = await axios.put(`${VITE_FUTURA_API}/users/${uid}/updateUser`, body);
        return response.data;
    }
);


//Update user's profile picture
export const updateUserPicture = createAsyncThunk(
    'users/updateUserPicture',
    async ({ uid, newFile }) => {
        try {
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


// == DELETE ======================>


// Delete user
export const deleteDBUser = createAsyncThunk(
    'users/deleteDBUser',
    async (uid) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${uid}/deleteUser`);
        return response.data;
    }
);


// -------------------------------------------------
// Loading can replaced to status
const usersSlice = createSlice({
    name: "usersSlice",
    initialState: {
        currentDBUser: null,
        currentDBUserPicture: null,
        currentDBUserStatus: "idle", // 'idle' | 'loading' | 'succeed' | 'failed'
    },
    reducers: {
        userCheckout: (state) => {
            state.currentDBUser = null;
            state.currentDBUserStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // --- CREATE ----
            .addCase(registerUser.pending, (state) => {
                state.currentDBUserStatus = "loading";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.currentDBUser = action.payload.data;
                state.currentDBUserStatus = "succeed";
            })

            .addCase(createUserProfile.pending, (state) => {
                state.currentDBUserStatus = "loading";
            })
            .addCase(createUserProfile.fulfilled, (state, action) => {
                state.currentDBUser = action.payload.data;
                state.currentDBUserStatus = "succeed";
            })
            
            .addCase(uploadUserPicture.pending, (state) => {
                state.currentDBUserPicture = null;
                state.currentDBUserStatus = "failed";
            })
            .addCase(uploadUserPicture.fulfilled, (state, action) => {
                state.currentDBUserPicture = action.payload;
                state.currentDBUserStatus = "succeed";
            })

            // --- READ -----
            .addCase(readCurrentUserProfile.pending, (state) => {
                state.currentDBUser = null;
                state.currentDBUserStatus = 'loading';
            })
            .addCase(readCurrentUserProfile.fulfilled, (state, action) => {
                state.currentDBUser = action.payload;
                state.currentDBUserStatus = 'succeed'

            })
            .addCase(readCurrentUserProfile.rejected, (state) => {
                state.currentDBUserStatus = 'failed';
            })

            .addCase(readCurrentUserPicture.pending, (state) => {
                state.currentDBUserPicture = null;
                state.currentDBUserStatus = 'loading'
            })
            .addCase(readCurrentUserPicture.fulfilled, (state, action) => {
                state.currentDBUserPicture = action.payload;
                state.currentDBUserStatus = 'succeed'
            })
            .addCase(readCurrentUserPicture.rejected, (state) => {
                state.currentDBUserStatus = 'failed'
            })

            // --- UPDATE -----
            .addCase(updateUserDetail.pending, (state) => {
                state.currentDBUserStatus = "loading";
            })
            .addCase(updateUserDetail.fulfilled, (state, action) => {
                state.currentDBUser = action.payload.updatedData;
                state.currentDBUserStatus = "succeed";
            })
            
            
            .addCase(updateUserPicture.fulfilled, (state, action) => {
                state.currentDBUserPicture = action.payload;
            })


            // --- DELETE -----
            .addCase(deleteDBUser.fulfilled, (state) => {
                state.currentDBUser = null;
                state.currentDBUserPicture = null;
                state.currentDBUserStatus = 'idle';
            })

            
    },
});


export const { userCheckout }  = usersSlice.actions;

export default usersSlice.reducer;