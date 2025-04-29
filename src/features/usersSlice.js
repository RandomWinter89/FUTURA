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

// ====== Follow Action ==============================================>

export const onFollow = createAsyncThunk(
    'users/onFollow',
    async ({id, followed_id}) => {
        const body = {
            followed_id: followed_id
        };

        const response = await axios.post(`${VITE_FUTURA_API}/users/${id}/following`, body);
        return response.data;
    }
);


export const onUnfollow = createAsyncThunk(
    'users/onUnfollow',
    async ({id, followed_id}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${id}/following/${followed_id}`);
        return response.data;
    }
);


// User Slice ================>

const usersSlice = createSlice({
    name: "usersSlice",
    initialState: {
        users: [],
        personal: [],
        // personalFollower: [],
        // personalFollowing: [],
        users_loading: true,
        personal_loading: true
    },
    reducers: {},
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



export default usersSlice.reducer;

// // Fetch personal followers
        // builder
        //     .addCase(fetch_PersonalFollower.fulfilled, (state, action) => {
        //         state.personalFollower = action.payload;

        //         console.log("Followers: ", state.personalFollower);
        //         if (state.personalFollower.length > 0 && state.personal.length > 0) {
        //             state.personal_loading = false;
        //         }
        //     })
        //     .addCase(fetch_PersonalFollower.pending, (state) => {
        //         state.personal_loading = true;
        //     });
        
        // // Fetch personal following
        // builder
        //     .addCase(fetch_PersonalFollower.fulfilled, (state, action) => {
        //         state.personalFollowing = action.payload;
        //     })
        //     .addCase(fetch_PersonalFollower.pending, (state) => {
        //         state.personal_loading = true;
        //     });

        // // Follow Action
        // builder
        //     .addCase(onFollow.fulfilled, (state, action) => {
        //         // const { id } = action.payload;
        //         // const user = state.users.find(user => user.id === id);
        //         // if (user) {
        //             console.log("increment follow")
        //             state.personalFollower.push(action.payload);
        //         // }
        //     });

        // // Unfollow Action
        // builder
        //     .addCase(onUnfollow.fulfilled, (state, action) => {
        //         const { followed_id } = action.payload;
        //         // const user = state.users.find(user => user.id === id);
        //         // if (user) {
        //             state.personalFollower = state.personalFollower.filter(follow => follow.followed_user_id !== followed_id);
        //             console.log("decrement follow: ", state.personalFollower);
        //             // }
        //     });