import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// == CREATE =======>

export const createAddress = createAsyncThunk(
    'users/createAddress',
    async ({uid, address_line1, address_line2, city, region, postal_code}) => {
        const body = {
            address_line1: address_line1, 
            address_line2: address_line2, 
            city: city, 
            region: region, 
            postal_code: postal_code
        }

        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/address`, body);
        return response.data;
    }
);

// == READ =======>

export const fetchAddress = createAsyncThunk(
    'users/fetchAddress',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/address`);
        return response.data;
    }
);

// == UPDATE =======>

export const updateAddress = createAsyncThunk(
    'users/updateAddress',
    async ({uid, address_id, address_line1, address_line2, city, region, postal_code}) => {
        const body = {
            address_line1: address_line1, 
            address_line2: address_line2, 
            city: city, 
            region: region, 
            postal_code: postal_code
        }

        const response = await axios.put(`${VITE_FUTURA_API}/users/${uid}/address/${address_id}`, body);
        return response.data;
    }
);


// ---------------------------------------------

const addressSlice = createSlice({
    name: "addressSlice",
    initialState: {
        address: [],
        addressStatus: "idle",
    },
    reducers: {
        clearAddressData: (state) => {
            state.address = [];
            state.addressStatus = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAddress.pending, (state) => {
                state.addressStatus = "loading";
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.address = [...state.address, action.payload.data];
                state.addressStatus = "succeed";
            })


            .addCase(fetchAddress.pending, (state) => {
                state.addressStatus = "loading";
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.address = action.payload.data;
                state.addressStatus = "succeed";
            })
            .addCase(fetchAddress.rejected, (state) => {
                state.addressStatus = "failed";
            })

            .addCase(updateAddress.fulfilled, (state, action) => {
                const data = action.payload.data;
                
                state.address = state.address.map((item) => {
                    if (item.id === data.id) {
                        return data;
                    }
                    return item;
                });

                console.log(state.address);
            })
    },
});

export const { clearAddressData } = addressSlice.actions;

export default addressSlice.reducer;