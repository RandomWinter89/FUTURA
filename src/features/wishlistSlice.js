import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Create WishlistID
export const createWishlist = createAsyncThunk(
    'users/CreateWishlist',
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

export const fetchWishlist_item = createAsyncThunk(
    'users/fetchWishlist_item',
    async (wishlist_id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/wishlist/${wishlist_id}/items`);
        return response.data;
    }
)

export const addWishlist_item = createAsyncThunk(
    'users/addWishlist_item',
    async ({uid, wishlist_id, product_id}) => {
        const body = {
            wishlist_id: wishlist_id,
        }

        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/wishlist/${product_id}`, body)
        return response.data;
    }
)

export const removeWishlist_item = createAsyncThunk(
    'users/removeWishlist_item',
    async ({uid, product_id, wishlist_id}) => {

        const response = await axios.delete(`${VITE_FUTURA_API}/users/${uid}/wishlist/${product_id}`, { 
            data: {wishlist_id}
        });
        return response.data;
    }
)

// export const fetch_PersonalFollowing 
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
        // Fetch all users
        builder
            .addCase(createWishlist.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
            })
        
        builder
            .addCase(fetchWishlistId.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
            })
    
        builder
            .addCase(fetchWishlist_item.fulfilled, (state, action) => {
                state.wishlists = action.payload;
                console.log("Finish Extract");
                state.loading = false;
            })
            .addCase(fetchWishlist_item.pending, (state) => {
                state.loading = true;
            });
        
        builder
            .addCase(addWishlist_item.fulfilled, (state, action) => {
                state.wishlists = [...state.wishlists, action.payload];
                state.loading = false;
            })
            .addCase(addWishlist_item.pending, (state) => {
                state.loading = true;
            });

        builder
            .addCase(removeWishlist_item.fulfilled, (state, action) => {
                state.wishlists = state.wishlists.filter((item) => item.id !== action.payload.id);
                state.loading = false;
            })
            .addCase(removeWishlist_item.pending, (state) => {
                state.loading = true;;
            });

    },
});

export const { resetWishlist }  = wishlistsSlice.actions;

export default wishlistsSlice.reducer;