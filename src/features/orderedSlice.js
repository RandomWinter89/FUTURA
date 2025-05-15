import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// User -> Create Order
export const createOrder = createAsyncThunk(
    'users/createOrder',
    async ({uid, shipping_address_id, shipping_method, order_total, order_status}) => {
        const body = {
            shipping_address_id: shipping_address_id, 
            shipping_method: shipping_method, 
            order_total: order_total, 
            order_status: order_status
        }
        
        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/order`, body);
        return response.data;
    }
);

// User -> Get Order
export const fetchOrder = createAsyncThunk(
    'users/fetchOrder',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/order`);
        return response.data;
    }
);

// Admin -> Get Entire Order
export const fetchAllOrder = createAsyncThunk(
    'admin/fetchAllOrder',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/orders`);
        return response.data;
    }
)

// Admin -> Update Order Status
export const updateOrderStatus = createAsyncThunk(
    'admin/updateOrderStatus',
    async ({order_id, status}) => {
        const body = {
            status: status
        }

        const response = await axios.put(`${VITE_FUTURA_API}/order/${order_id}`, body);
        return response.data;
    }
)

// Order -> Create item inside
export const create_OrderItem = createAsyncThunk(
    'users/create_OrderItem',
    async ({order_id, product_id, quantity, price, product_variation_id}) => {
        const body = {
            product_id: product_id,
            quantity: quantity, 
            price: price,
            product_variation_id: product_variation_id
        }

        const response = await axios.post(`${VITE_FUTURA_API}/order/${order_id}`, body);
        return response.data;
    }
);

// Order -> Get item
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
        orderId: null,
        order_loading: false,
        orderItem_loading: false,
    },
    reducers: {
        reset_OrderReceipt: (state) => {
            state.orderItem = [];
            state.orderItem_loading = false;
        }, 
        reset_orderId: (state) => {
            state.orderId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orderId = action.payload.data?.id;
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
                state.orderItem = [...state.orderItem, action.payload.data];
                state.orderItem_loading = false;
            })
            .addCase(create_OrderItem.pending, (state) => {
                state.orderItem_loading = true;
            });

        //UPDATE ORDER STATUS
        builder
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.order = state.order.map((item) => {
                    if (item.id == data.id)
                        return {...item, order_status: data.order_status}

                    return item;
                })
            })

        builder
            .addCase(fetchAllOrder.fulfilled, (state, action) => {
                state.order = action.payload.data;
            })

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

export const { reset_OrderReceipt } = ordersSlice.actions;

export default ordersSlice.reducer;