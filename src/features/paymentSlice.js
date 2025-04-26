import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch all users

export const createPayment = createAsyncThunk(
    'users/createPayment',
    async (id) => {
        const response = await axios.post(`${VITE_FUTURA_API}/users/${id}/payment`);
        return response.data;
    }
);

export const fetchPayment = createAsyncThunk(
    'users/fetchPayment',
    async ({id, payment_type, provider, account_number, expiry_date, is_default}) => {
        const body = {
            payment_type: payment_type, 
            provider: provider, 
            account_number: account_number, 
            expiry_date: expiry_date, 
            is_default: is_default
        }

        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/payment`, body);
        return response.data;
    }
);

export const updatePayment = createAsyncThunk(
    'users/updatePayment',
    async ({id, paymentId, payment_type, provider, account_number, expiry_date, is_default}) => {
        const body = {
            payment_type: payment_type, 
            provider: provider, 
            account_number: account_number, 
            expiry_date: expiry_date, 
            is_default: is_default
        }

        const response = await axios.put(`${VITE_FUTURA_API}/users/${id}/payment/${paymentId}`, body);
        return response.data;
    }
);

export const deletePayment = createAsyncThunk(
    'users/deletePayment',
    async ({id, paymentId}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${id}/payment/${paymentId}`);
        return response.data;
    }
);


// export const fetch_PersonalFollowing 

const paymentsSlice = createSlice({
    name: "paymentsSlice",
    initialState: {
        payment: [],
        payment_loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.fulfilled, (state, action) => {
                state.payment = [...state.payment, action.payload.data];
                state.payment_loading = false;
            })
            .addCase(createPayment.pending, (state) => {
                state.payment_loading = true;
            });
        
        builder
            .addCase(fetchPayment.fulfilled, (state, action) => {
                state.payment = action.payload.data;
                state.payment_loading = false;
            })
            .addCase(fetchPayment.pending, (state) => {
                state.payment_loading = true;
            });

        builder
            .addCase(updatePayment.fulfilled, (state, action) => {
                state.payment = state.payment.map((item) => {
                    if (item.id === action.payload.data.id) {
                        return action.payload.data;
                    }
                    return item;
                });
                state.payment_loading = false;
            })
            .addCase(updatePayment.pending, (state) => {
                state.payment_loading = true;
            });

        builder
            .addCase(deletePayment.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.payment = state.payment.filter((item) => item.id !== data.id);
                state.payment_loading = false;
            })
            .addCase(deletePayment.pending, (state) => {
                state.payment_loading = true;
            });

    },
});

export default paymentsSlice.reducer;