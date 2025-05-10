import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ====== User Action ==============================================>

// Fetch all users (only name and age)
export const fetchAllUser = createAsyncThunk(
    'users/fetchAllUser',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/users`);
        return response.data;
    }
);

// Fetch own data
export const fetchProfile = createAsyncThunk(
    'users/fetchProfile',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}`);
        return response.data;
    }
);

// Create user database
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


// Update user database
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


// Delete user database
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${id}`);
        return response.data;
    }
);

// User Slice ================>

const usersSlice = createSlice({
    name: "usersSlice",
    initialState: {
        users: [],
        personal: {},
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
            // .addCase(fetchProfile.rejected, (state, action) => {
            //     state.report = 
            // })

        // Create User =============>
        builder
            .addCase(createUser.fulfilled, (state, action) => {
                state.personal = action.payload.data;
                state.personal_loading = false;
            })
            .addCase(createUser.pending, (state) => {
                state.personal_loading = true;
            })

        // Update User =============>
        builder
            .addCase(updateUser.fulfilled, (state, action) => {
                console.log("Update User: ", action.payload.updatedData);
                // state.personal = action.payload.updatedData;
                state.personal_loading = false;
            })
            .addCase(updateUser.pending, (state) => {
                state.personal_loading = true;
            })

        // Delete User =============>
        builder
            .addCase(deleteUser.fulfilled, (state) => {
                state.personal = [];
                state.personal_loading = true;
            })
        
    },
});


export const { userCheckout }  = usersSlice.actions;

export default usersSlice.reducer;