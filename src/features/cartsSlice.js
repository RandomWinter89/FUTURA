import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Create CartID
export const createCart = createAsyncThunk(
    'users/createCart',
    async (id) => {
        const response = await axios.post(`${VITE_FUTURA_API}/users/${id}/cart`);
        return response.data;
    }
);

// Fetch CartID
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
    async ({cart_id, product_item_id, quantity}) => {
        const body = {
            product_item_id: product_item_id,
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
    async ({cart_id, product_item_id, quantity}) => {
        const body = {
            product_item_id: product_item_id,
            quantity: quantity
        }

        const response = await axios.put(`${VITE_FUTURA_API}/cart/${cart_id}/updateQuantity`, body);
        return response.data;
    }
);

// Remove Cart Item
export const removeCartItem = createAsyncThunk(
    'users/removeCartItem',
    async ({cart_id ,product_item_ids}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/cart/${cart_id}/removeProduct`, {
            data: { product_item_ids }
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

const cartsSlice = createSlice({
    name: "cartsSlice",
    initialState: {
        cart_id: null,
        carts: [],
        loading: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Create CartID
        builder
            .addCase(createCart.fulfilled, (state, action) => {
                state.cart_id = action.payload.data;
            })
        
        // Get CartID
        builder
            .addCase(fetchCartId.fulfilled, (state, action) => {
                state.cart_id = action.payload.data;
            })

        // ===========================

        // Add Cart Item
        builder
            .addCase(addCart_item.fulfilled, (state, action) => {
                state.carts.push(action.payload.data);
                state.loading = false;
            })
            .addCase(addCart_item.pending, (state) => {
                state.loading = true;
            });

        // Fetch Cart Item
        builder
            .addCase(fetchCart_item.fulfilled, (state, action) => {
                state.carts = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchCart_item.pending, (state) => {
                state.loading = true;
            });

        // Update Cart Quantity
        builder
            .addCase(updateItem_quantity.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.carts = state.carts.map((item) => {
                    if (item.product_item_id === data.product_item_id) {
                        return {...item, quantity: data.quantity}
                    }

                    return item;
                })
                state.loading = false;
            })
            .addCase(updateItem_quantity.pending, (state) => {
                state.loading = true;
            });

        // Delete Cart Items
        builder
            .addCase(removeCartItem.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.carts = state.carts.filter((item) => {
                    return !data.product_item_ids.includes(item.product_item_id);
                });

                state.loading = false;
            })
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
            });

        // Clear Cart
        builder
            .addCase(clearCart.fulfilled, (state) => {
                state.carts = [];
                state.loading = false;
            })
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
            });
    },
});

export default cartsSlice.reducer;