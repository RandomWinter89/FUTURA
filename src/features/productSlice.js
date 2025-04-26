import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch all users

export const fetchProducts = createAsyncThunk(
    'users/fetchProducts',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/products`);
        return response.data;
    }
);

export const fetchProductsByCategory = createAsyncThunk(
    'users/fetchProductsByCategory',
    async (category_id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products?category=${category_id}`);
        return response.data;
    }
);

export const fetchCategory = createAsyncThunk(
    'users/fetchCategory',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/categories`);
        return response.data;
    }
);

export const fetchProductItem = createAsyncThunk(
    'users/fetchProductItem',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/${id}`);
        return response.data;
    }
);

export const fetch_ProductVariation = createAsyncThunk(
    'users/fetch_ProductVariation',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/${id}/variation`);
        return response.data;
    }
);

// export const fetch_PersonalFollowing 

// Need to figure out homepage method and category method
const productsSlice = createSlice({
    name: "productsSlice",
    initialState: {
        products: {
            highlight: [],
            endless: [],
        },

        productItem: [],
        ItemVariation: [],

        categories: [],
        products_loading: false,
        productItem_loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all users
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products.endless = [...action.payload, ...state.products.endless];
                state.products_loading = false;
            })
            .addCase(fetchProducts.pending, (state) => {
                state.products_loading = true;
            });

        builder
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.products.highlight = [...action.payload, ...state.products.highlight];
                state.productItem_loading = false;
            })
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.productItem_loading = true;
            });

        builder
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.categories = action.payload;
            });

        builder
            .addCase(fetchProductItem.fulfilled, (state, action) => {
                state.productItem = action.payload;
                state.products_loading = false;
            })
            .addCase(fetchProductItem.pending, (state) => {
                state.products_loading = true;
            });

        builder
            .addCase(fetch_ProductVariation.fulfilled, (state, action) => {
                state.ItemVariation = action.payload;
                state.productItem_loading = false;
            })
            .addCase(fetch_ProductVariation.pending, (state) => {
                state.productItem_loading = true;
            });

    },
});

export default productsSlice.reducer;