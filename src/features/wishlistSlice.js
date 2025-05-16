import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Create WishlistID
export const createWishlist = createAsyncThunk(
    'users/CreateWishlist',
    async (uid) => {
        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/wishlist_id`);
        return response.data;
    }
);

export const fetchWishlistId = createAsyncThunk(
    'users/fetchWishlistId',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/wishlist_id`);
        return response.data;
    }
);

//
export const fetchWishlist_item = createAsyncThunk(
    'users/fetchWishlist_item',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/wishlist`);
        return response.data;
    }
)

// == ADD item to wishlist
export const addWishlist_item = createAsyncThunk(
    'users/addWishlist_item',
    async ({uid, wishlist_id, product_id}) => {
        const body = {
            product_id: product_id,
            wishlist_id: wishlist_id
        }

        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/wishlist`, body)
        return response.data;
    }
)

// == REMOVE item from wishlist
export const removeWishlist_item = createAsyncThunk(
    'users/removeWishlist_item',
    async ({uid, product_id, wishlist_id}) => {

        const response = await axios.delete(`${VITE_FUTURA_API}/users/${uid}/wishlist/${product_id}`, { 
            data: {wishlist_id}
        });

        return response.data;
    }
)


const wishlistsSlice = createSlice({
    name: "cartsSlice",
    initialState: {
        wishlist_id: null,
        wishlists: [],
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
            .addCase(createWishlist.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
            })
            .addCase(fetchWishlistId.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
            })
            .addCase(fetchWishlist_item.fulfilled, (state, action) => {
                state.wishlists = action.payload;
                state.loading = false;
            })
            .addCase(fetchWishlist_item.pending, (state) => {
                state.loading = true;
            })
            .addCase(addWishlist_item.fulfilled, (state, action) => {
                state.wishlists.push(action.payload);
                state.loading = false;
            })
            .addCase(addWishlist_item.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeWishlist_item.fulfilled, (state, action) => {
                state.wishlists = state.wishlists.filter(
                    (item) => item.id !== action.payload.id
                );
                state.loading = false;
            })

    },
});

export const { resetWishlist }  = wishlistsSlice.actions;

export default wishlistsSlice.reducer;