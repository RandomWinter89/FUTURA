import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch all users

export const fetchAllUser = createAsyncThunk(
    'users/fetchAllUser',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/users`);
        return response.data;
    }
);

export const fetch_PersonalFollower = createAsyncThunk(
    'users/fetchPersonalFollower',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/followers`);
        return response.data;
    }
);

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

// export const fetch_PersonalFollowing 

const usersSlice = createSlice({
    name: "usersSlice",
    initialState: {
        users: [],
        personal: [],
        personalFollower: [],
        personalFollowing: [],
        users_loading: true,
        personal_loading: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all users
        builder
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.users = action.payload;
                state.users_loading = false;
            })
            .addCase(fetchAllUser.pending, (state) => {
                state.users_loading = true;
            });

        // Fetch personal followers
        builder
            .addCase(fetch_PersonalFollower.fulfilled, (state, action) => {
                state.personalFollower = action.payload;

                console.log("Followers: ", state.personalFollower);
                if (state.personalFollower.length > 0 && state.personal.length > 0) {
                    state.personal_loading = false;
                }
            })
            .addCase(fetch_PersonalFollower.pending, (state) => {
                state.personal_loading = true;
            });
        
        // Fetch personal following

        // Follow Action
        builder
            .addCase(onFollow.fulfilled, (state, action) => {
                // const { id } = action.payload;
                // const user = state.users.find(user => user.id === id);
                // if (user) {
                    console.log("increment follow")
                    state.personalFollower.push(action.payload);
                // }
            });

        // Unfollow Action
        builder
            .addCase(onUnfollow.fulfilled, (state, action) => {
                const { followed_id } = action.payload;
                // const user = state.users.find(user => user.id === id);
                // if (user) {
                    state.personalFollower = state.personalFollower.filter(follow => follow.followed_user_id !== followed_id);
                    console.log("decrement follow: ", state.personalFollower);
                    // }
            });
    },
});

export default usersSlice.reducer;