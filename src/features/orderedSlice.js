import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

export const createOrder = createAsyncThunk(
    'users/createOrder',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/order`);
        return response.data;
    }
);

export const fetchOrder = createAsyncThunk(
    'users/fetchOrder',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/order`);
        return response.data;
    }
);

export const create_OrderItem = createAsyncThunk(
    'users/create_OrderItem',
    async ({order_id, product_item_id, quantity, price}) => {
        const body = {
            product_item_id: product_item_id,
            quantity: quantity, 
            price: price
        }

        const response = await axios.post(`${VITE_FUTURA_API}/order/${order_id}`, body);
        return response.data;
    }
);

export const get_OrderItem = createAsyncThunk(
    'users/get_OrderItem',
    async (order_id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/order/${order_id}`);
        return response.data;
    }
);

const ordersSlice = createSlice({
    name: "ordersSlice",
    initialState: {
        order: [],
        orderItem: [],
        order_loading: false,
        orderItem_loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.fulfilled, (state, action) => {
                state.order = [...state.order, action.payload.data];
            })

        builder
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.order = action.payload.data;
                state.users_loading = false;
            })
            .addCase(fetchOrder.pending, (state) => {
                state.users_loading = true;
            });

        builder
            .addCase(create_OrderItem.fulfilled, (state, action) => {
                state.orderItem = [action.payload.data, ...state.orderItem];
                state.orderItem_loading = false;
            })
            .addCase(create_OrderItem.pending, (state) => {
                state.orderItem_loading = true;
            });

        builder
            .addCase(get_OrderItem.fulfilled, (state, action) => {
                state.orderItem = action.payload.data;
                state.orderItem_loading = false;
            })
            .addCase(get_OrderItem.pending, (state) => {
                state.orderItem_loading = true;
            });
    },
});

export default ordersSlice.reducer;