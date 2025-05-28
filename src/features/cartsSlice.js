import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ---------------------------------------------------

// == CREATE ================>

// Create cart id
export const createCart = createAsyncThunk(
    'users/createCart',
    async (id) => {
        const response = await axios.post(`${VITE_FUTURA_API}/users/${id}/cart`);
        return response.data;
    }
);

// Read cart id 
export const fetchCartId = createAsyncThunk(
    'users/fetchCartId',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/cart`);
        return response.data;
    }
);

// ===================================================

// Add Cart Item
export const addCart_item = createAsyncThunk(
    'users/addCart_item',
    async ({cart_id, product_id, product_variation_id, quantity}) => {
        const body = {
            product_id: product_id,
            product_variation_id: product_variation_id,
            quantity: quantity
        }

        const response = await axios.post(`${VITE_FUTURA_API}/cart/${cart_id}/addProduct`, body);
        return response.data;
    }
);

// Get Cart Item
export const fetchCart_item = createAsyncThunk(
    'users/fetchCart_item',
    async (cart_id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/cart/${cart_id}/items`);
        return response.data;
    }
);

// Update Cart Quantity
export const updateItem_quantity = createAsyncThunk(
    'users/updateItem_quantity',
    async ({cart_id, product_id, product_variation_id, quantity}) => {
        const body = {
            product_id: product_id,
            product_variation_id: product_variation_id,
            quantity: quantity
        }

        console.log("Update Quantity: ", cart_id, product_id, product_variation_id, quantity);

        const response = await axios.put(`${VITE_FUTURA_API}/cart/${cart_id}/updateQuantity`, body);
        return response.data;
    }
);

// Remove Cart Item
export const removeCartItem = createAsyncThunk(
    'users/removeCartItem',
    async ({cart_id, product_id, product_variation_id}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/cart/${cart_id}/removeProduct`, { 
            data: {product_id, product_variation_id}
        });
        return response.data;
    }
);

// Clear Cart Item
export const clearCart = createAsyncThunk(
    'users/clearCart',
    async (cart_id) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/cart/${cart_id}/clear`);
        return response.data;
    }
);

// --------------------------------------

const cartsSlice = createSlice({
    name: "cartsSlice",
    initialState: {
        cart_id: null,
        carts: [],
        cartStatus: "idle",
        cartActionStatus: "idle",
    },
    reducers: {
        clearCartData: (state) => {
            state.cart_id = null;
            state.carts = [];
            state.cartStatus = "idle",
            state.cartActionStatus = "idle"
        },
        
    },
    extraReducers: (builder) => {
        // Create CartID
        builder
            .addCase(createCart.fulfilled, (state, action) => {
                state.cart_id = action.payload.data.id;
            })
        
            .addCase(fetchCartId.fulfilled, (state, action) => {
                state.cart_id = action.payload.data.id;
            })

            //CREATE ITEM TO CART
            .addCase(addCart_item.pending, (state) => {
                state.cartStatus = "loading";
                state.cartActionStatus = "loading";
            })
            .addCase(addCart_item.fulfilled, (state, action) => {
                state.carts = [...state.carts, action.payload.data];
                state.cartStatus = "succeed";
                state.cartActionStatus = "succeed";
            })
            .addCase(addCart_item.rejected, (state) => {
                state.cartStatus = "failed";
                state.cartActionStatus = "failed";
            })

            //READ ITEM FROM CART    
            .addCase(fetchCart_item.pending, (state) => {
                state.cartStatus = "loading"
            })
            .addCase(fetchCart_item.fulfilled, (state, action) => {
                state.carts = action.payload.data;
                
                if (action.payload.data.length == 0) {
                    state.cartStatus = "failed";
                } else {
                    state.cartStatus = "succeed";
                }
            })
            .addCase(fetchCart_item.rejected, (state) => {
                state.cartStatus = "failed";
            })

            //UPDATE ITEM QUANTITY FROM CART
            .addCase(updateItem_quantity.fulfilled, (state, action) => {
                const data = action.payload.data;

                state.carts = state.carts.map((item) => {
                    if (item.id === data.id) {
                        return {...item, quantity: data.quantity}
                    }

                    return item;
                })
            })

            //DELETE ITEM FROM CART
            .addCase(removeCartItem.pending, (state) => {
                state.cartActionStatus = "loading";
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.carts = state.carts.filter((item) => item.id !== data.id);

                if (state.carts.length == 0)
                    state.cartStatus = "failed";

                state.cartActionStatus = "succeed"
            })
            .addCase(removeCartItem.rejected, (state) => {
                state.cartActionStatus = "failed";
            })

            //CLEAR CART
            .addCase(clearCart.fulfilled, (state) => {
                state.carts = [];
                state.cartStatus = "idle";
            })
            .addCase(clearCart.pending, (state) => {
                state.cartStatus = "loading";
            })
    },
});

export const { clearCartData } = cartsSlice.actions;

export default cartsSlice.reducer;