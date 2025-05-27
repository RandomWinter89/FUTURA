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
        console.log("Fetching all orders...");
        const response = await axios.get(`${VITE_FUTURA_API}/orders`);
        return response.data;
    }
);

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

export const createOrderItems = createAsyncThunk(
    'users/createOrderItems',
    async ({order_id, items}) => {
        const response = await axios.post(`${VITE_FUTURA_API}/order/${order_id}`, items);
        return response.data;
    }
)

// Order -> Get item
export const get_OrderItem = createAsyncThunk(
    'users/get_OrderItem',
    async (order_id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/order/${order_id}`);
        return response.data;
    }
);

export const getAllItem = createAsyncThunk(
    'users/getAllItem',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/user/${uid}/order/items`);
        return response.data;
    }
)

const ordersSlice = createSlice({
    name: "ordersSlice",
    initialState: {
        orderId: null,
        order: [],
        orderItem: [],

        orderStatus: "idle",
        orderItemStatus: "idle",
    },
    reducers: {
        reset_OrderReceipt: (state) => {
            state.orderItem = [];
            state.orderItemStatus = "idle";
        }, 
        clearOrderData: (state) => {
            state.orderId = null;
            state.order = [],
            state.orderItem = [],
            state.orderStatus = "idle",
            state.orderItemStatus = "idle"
        }
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orderId = action.payload.data?.id;
                state.order = [...state.order, action.payload.data];
            })

            .addCase(createOrderItems.pending, (state) => {
                state.orderItemStatus = "loading";
            })
            .addCase(createOrderItems.fulfilled, (state) => {
                state.orderItemStatus = "succeed";
            })
            

            .addCase(getAllItem.fulfilled, (state, action) => {
                state.orderItem = action.payload.data;
            })

            // READ
            .addCase(fetchOrder.pending, (state) => {
                state.orderStatus = "loading";
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.order = action.payload.data;
                state.orderStatus = "failed";
            })
            
            .addCase(fetchAllOrder.pending, (state) => {
                state.orderStatus = "loading";
            })
            .addCase(fetchAllOrder.fulfilled, (state, action) => {
                state.order = action.payload.data;
                state.orderStatus = "succeed";
            })

            .addCase(get_OrderItem.fulfilled, (state, action) => {
                state.orderItem = action.payload.data;
                state.orderItemStatus = "succeed";
            })
            .addCase(get_OrderItem.pending, (state) => {
                state.orderItemStatus = "loading";
            })

            //UPDATE
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.order = state.order.map((item) => {
                    if (item.id == data.id)
                        return {...item, order_status: data.order_status}

                    return item;
                })
            });
    },
});

export const { reset_OrderReceipt, clearOrderData } = ordersSlice.actions;

export default ordersSlice.reducer;