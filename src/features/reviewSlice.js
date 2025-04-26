import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch all users

export const createReview = createAsyncThunk(
    'users/createReview',
    async ({id, product_id, comment, rating_value}) => {
        const body = {
            product_id: product_id,
            comment: comment,
            rating_value: rating_value
        }

        const response = await axios.post(`${VITE_FUTURA_API}/users/${id}/review`, body);
        return response.data;
    }
);

export const fetch_ownReviews = createAsyncThunk(
    'users/fetch_ownReviews',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${id}/review`);
        return response.data;
    }
);

export const fetch_productReviews = createAsyncThunk(
    'users/fetch_productReviews',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/${id}/review`);
        return response.data;
    }
);

export const deleteReview = createAsyncThunk(
    'users/deleteReview',
    async ({id, review_id}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${id}/review/${review_id}`);
        return response.data;
    }
);

export const updateReview = createAsyncThunk(
    'users/updateReview',
    async ({id, review_id, rating_value, comment}) => {
        const body = {
            rating_value: rating_value,
            comment: comment
        };

        const response = await axios.put(`${VITE_FUTURA_API}/users/${id}/review/${review_id}`, body);
        return response.data;
    }
);

// export const fetch_PersonalFollowing 

const reviewsSlice = createSlice({
    name: "reviewsSlice",
    initialState: {
        ownReviews: [],
        productReviews: [],
        ownReviews_loading: false,
        productReviews_loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all users
        builder
            .addCase(createReview.fulfilled, (state, action) => {
                state.ownReviews = [...state.ownReviews, ...action.payload.data];
                state.productReviews = [...state.productReviews, ...action.payload.data];
            })
        
        builder
            .addCase(fetch_ownReviews.fulfilled, (state, action) => {
                state.ownReviews = action.payload.data;
                state.ownReviews_loading = false;
            })
            .addCase(fetch_ownReviews.pending, (state) => {
                state.ownReviews_loading = true;
            });
    
        builder
            .addCase(fetch_productReviews.fulfilled, (state, action) => {
                state.productReviews = action.payload.data;
                state.productReviews_loading = false;
            })
            .addCase(fetch_productReviews.pending, (state) => {
                state.productReviews_loading = true;
            });

        builder
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.ownReviews = state.ownReviews.filter(review => review.id !== action.payload.data.id);
                state.productReviews = state.productReviews.filter(review => review.id !== action.payload.data.id);
            })
    
        builder
            .addCase(updateReview.fulfilled, (state, action) => {
                const data = action.payload.data;
                const index = state.ownReviews.findIndex(review => review.id === data.id);
                if (index !== -1) {
                    state.ownReviews[index] = data;
                }

                const productIndex = state.productReviews.findIndex(review => review.id === data.id && review.product_id === data.product_id);
                if (productIndex !== -1) {
                    state.productReviews[productIndex] = data;
                }
            })

    },
});

export default reviewsSlice.reducer;