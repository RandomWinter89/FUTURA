import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch all users

export const createReview = createAsyncThunk(
    'users/createReview',
    async ({uid, product_id, comment, rating_value}) => {
        const body = {
            product_id: product_id,
            comment: comment,
            rating_value: rating_value
        }

        const response = await axios.post(`${VITE_FUTURA_API}/users/${uid}/review`, body);
        return response.data;
    }
);

export const fetch_ownReviews = createAsyncThunk(
    'users/fetch_ownReviews',
    async (uid) => {
        const response = await axios.get(`${VITE_FUTURA_API}/users/${uid}/review`);
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
    async ({uid, review_id}) => {
        const response = await axios.delete(`${VITE_FUTURA_API}/users/${uid}/review/${review_id}`);
        return response.data;
    }
);

export const updateReview = createAsyncThunk(
    'users/updateReview',
    async ({uid, review_id, rating_value, comment}) => {
        const body = {
            rating_value: rating_value,
            comment: comment
        };

        const response = await axios.put(`${VITE_FUTURA_API}/users/${uid}/review/${review_id}`, body);
        return response.data;
    }
);

// export const fetch_PersonalFollowing 

const reviewsSlice = createSlice({
    name: "reviewsSlice",
    initialState: {
        ownReviews: [],
        productReviews: [],

        currentUserReviewStatus: "idle",
        productReviewStatus: "idle",
    },
    reducers: {
        clearReviewData: (state) => {
            state.ownReviews = [],
            state.currentUserReviewStatus = "idle"
        }
    },
    extraReducers: (builder) => {
        // Fetch all users
        builder
            // CREATE REVIEWS
            .addCase(createReview.fulfilled, (state, action) => {
                state.ownReviews = [...state.ownReviews, action.payload.data];
                state.productReviews = [...state.productReviews, action.payload.data];
            })
            
            // READ OWN REVIEWS
            .addCase(fetch_ownReviews.pending, (state) => {
                state.currentUserReviewStatus = "loading";
            })
            .addCase(fetch_ownReviews.fulfilled, (state, action) => {
                state.ownReviews = action.payload.data;
                state.currentUserReviewStatus = "succeed";
            })
            .addCase(fetch_ownReviews.rejected, (state) => {
                state.currentUserReviewStatus = "failed";
            })
    
            // READ PRODUCT REVIEWS
            .addCase(fetch_productReviews.pending, (state) => {
                state.productReviewStatus = "loading";
            })
            .addCase(fetch_productReviews.fulfilled, (state, action) => {
                state.productReviews = action.payload.data;
                state.productReviewStatus = "succeed";
            })
            .addCase(fetch_productReviews.rejected, (state) => {
                state.productReviewStatus = "failed";
            })

            // UPDATE REVIEW
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

            // DELETE REVIEW
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.ownReviews = state.ownReviews.filter(review => review.id !== action.payload.data.id);
                state.productReviews = state.productReviews.filter(review => review.id !== action.payload.data.id);
            })
    },
});

export const { clearReviewData } = reviewsSlice.actions;
export default reviewsSlice.reducer;