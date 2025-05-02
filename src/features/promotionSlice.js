import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch all users

export const fetchPromotion_Category = createAsyncThunk(
    'promotion/fetchPromotion_Category',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/promotion/category`);
        return response.data;
    }
);

export const fetchPromotion = createAsyncThunk(
    'promotion/fetchPromotion',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/promotion`);
        return response.data;
    }
);

const promotionsSlice = createSlice({
    name: "promotionsSlice",
    initialState: {
        promotionCategory: [],
        promotionCategory_loading: false,
        promotion: [],
        promotion_loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all users
        builder
            .addCase(fetchPromotion_Category.fulfilled, (state, action) => {
                state.promotionCategory = action.payload;
                state.promotionCategory_loading = false;
            })
            .addCase(fetchPromotion_Category.pending, (state) => {
                state.promotionCategory_loading = true;
            });

        builder
            .addCase(fetchPromotion.fulfilled, (state, action) => {
                state.promotion = action.payload;
                state.promotion_loading = false;
            })
            .addCase(fetchPromotion.pending, (state) => {
                state.promotion_loading = true;
            });
    },
});

export default promotionsSlice.reducer;