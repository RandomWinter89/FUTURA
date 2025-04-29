import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;


export const createAddress = createAsyncThunk(
    'users/createAddress',
    async ({id, address_line1, address_line2, city, region, postal_code}) => {
        const body = {
            address_line1: address_line1, 
            address_line2: address_line2, 
            city: city, 
            region: region, 
            postal_code: postal_code
        }

        const response = await axios.post(`${VITE_FUTURA_API}/users/${id}/address`, body);
        return response.data;
    }
);


export const fetchAddress = createAsyncThunk(
    'users/fetchAddress',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/address`);
        return response.data;
    }
);


export const updateAddress = createAsyncThunk(
    'users/updateAddress',
    async ({id, address_id, address_line1, address_line2, city, region, postal_code}) => {
        const body = {
            address_line1: address_line1, 
            address_line2: address_line2, 
            city: city, 
            region: region, 
            postal_code: postal_code
        }

        const response = await axios.put(`${VITE_FUTURA_API}/users/${id}/address/${address_id}`, body);
        return response.data;
    }
);


export const removeAddress = createAsyncThunk(
    'users/removeAddress',
    async ({id, address_id}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${id}/address/${address_id}`);
        return response.data;
    }
);

const addressSlice = createSlice({
    name: "addressSlice",
    initialState: {
        address: [],
        address_loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAddress.fulfilled, (state, action) => {
                state.address = [...state.address, ...action.payload.data];
                state.address_loading = false;
            })
            .addCase(createAddress.pending, (state) => {
                state.address_loading = true;
            });

        builder
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.address = action.payload.data;
                state.address_loading = false;
            })
            .addCase(fetchAddress.pending, (state) => {
                state.address_loading = true;
            });

        builder
            .addCase(updateAddress.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.address = state.address.map((item) => {
                    if (item.id === data.id) {
                        return data;
                    }
                    return item;
                });
                state.address_loading = false;
            })
            .addCase(updateAddress.pending, (state) => {
                state.address_loading = true;
            });

        builder
            .addCase(removeAddress.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.address = state.address.filter((item) => item.id !== data.id);
            })
    },
});

export default addressSlice.reducer;