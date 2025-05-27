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

// Toggle Wishlist
export const updateWishlistToggle = createAsyncThunk(
    'users/updateWishlists',
    async ({uid, product_id}) => {
        const response = await axios.put(`${VITE_FUTURA_API}/users/${uid}/wishlist/${product_id}`);
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
        wishlistActionStatus: "idle",
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const respondID = parseInt(action.payload.product_id);

            if (state.wishlists.find(prev => prev.product_id == respondID)) {
                state.wishlists = state.wishlists.filter(
                    (item) => item.product_id !== respondID
                );

                if (state.wishlists.length == 0 || state.wishlists == null) {
                    state.wishlistStatus = "failed";
                }
            }
            else {
                state.wishlists.push(action.payload);
                state.wishlistStatus = "succeed";
            }
        },
        clearWishlistData: (state) => {
            state.wishlist_id = null;
            state.wishlists = [];
            state.wishlistStatus = "idle";
            state.wishlistActionStatus = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUserWishlistID.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
                state.wishlistStatus = "succeed";
            })

            .addCase(fetchWishlistId.pending, (state) => {
                state.wishlistStatus = "loading";
            })
            .addCase(fetchWishlistId.fulfilled, (state, action) => {
                state.wishlist_id = action.payload.id;
                state.wishlistStatus = "succeed";
            })

            
            .addCase(readUserWishlists.pending, (state) => {
                state.wishlistStatus = "loading";
            })
            .addCase(readUserWishlists.fulfilled, (state, action) => {
                state.wishlists = action.payload;
                state.wishlistStatus = "succeed";
            })
            .addCase(readUserWishlists.rejected, (state) => {
                state.wishlistStatus = "failed";
            })


            .addCase(updateWishlistToggle.pending, (state) => {
                state.wishlistActionStatus = "loading";
            })
            .addCase(updateWishlistToggle.fulfilled, (state) => {
                state.wishlistActionStatus = "succeed";
            })
            .addCase(updateWishlistToggle.rejected, (state, action) => {
                state.wishlistActionStatus = "failed";
                const productId = action.meta.arg.product_id;
                
                if (state.wishlists.find(prev => prev.product_id == productId)) {
                    state.wishlists = state.wishlists.filter(
                        (item) => item.product_id !== productId
                    );
                }
                else {
                    state.wishlists.push(productId);
                }
            })
    },
});

export const { clearWishlistData, toggleWishlist }  = wishlistsSlice.actions;

export default wishlistsSlice.reducer;