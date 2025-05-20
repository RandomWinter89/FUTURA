import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ---------------------------------------------------------

// == USER'S WISHLIST ======================>


export const createUserWishlistID = createAsyncThunk(
    'users/createUserWishlistID',
    async (uid) => {
        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/wishlist`);
        return response.data;
    }
);

export const fetchWishlistId = createAsyncThunk(
    'users/fetchWishlistId',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/wishlist`);
        return response.data;
    }
);

// == WISHLIST ITEM ======================>


export const readUserWishlists = createAsyncThunk(
    'users/readUserWishlists',
    async (uid) => {

        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/wishlist/readItem`);
        return response.data;
    }
)

export const addToUserWishlists = createAsyncThunk(
    'users/addToUserWishlists',
    async ({uid, wishlist_id, product_id}) => {
        const body = {
            product_id: product_id,
            wishlist_id: wishlist_id
        }

        

        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/wishlist/addItem`, body)
        return response.data;
    }
)

export const removeFromUserWishlists = createAsyncThunk(
    'users/removeFromUserWishlists',
    async ({uid, product_id, wishlist_id}) => {

        const response = await axios.delete(`${VITE_FUTURA_API}/users/${uid}/wishlist/${product_id}`, { 
            data: {wishlist_id}
        });

        return response.data;
    }
)


// -------------------------------------------------
// Loading replaced to status
const wishlistsSlice = createSlice({
    name: "cartsSlice",
    initialState: {
        wishlist_id: null,
        wishlists: [],
        wishlistStatus: "idle",
        loading: false,
    },
    reducers: {

        resetWishlist: (state) => {
            state.wishlist_id = null;
            state.wishlists = [];
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUserWishlistID.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
            })
            .addCase(fetchWishlistId.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
            })
            .addCase(readUserWishlists.fulfilled, (state, action) => {
                state.wishlists = action.payload;
                state.loading = false;
            })
            .addCase(readUserWishlists.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToUserWishlists.fulfilled, (state, action) => {
                state.wishlists.push(action.payload);
                state.loading = false;
            })
            .addCase(addToUserWishlists.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromUserWishlists.fulfilled, (state, action) => {
                state.wishlists = state.wishlists.filter(
                    (item) => item.id !== action.payload.id
                );
                state.loading = false;
            })

    },
});

export const { resetWishlist }  = wishlistsSlice.actions;

export default wishlistsSlice.reducer;