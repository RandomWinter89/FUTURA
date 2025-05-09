import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// Fetch Products =================================== >
export const fetchProducts = createAsyncThunk(
    'users/fetchProducts',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/products`);
        return response.data;
    }
);

export const fetchImageProduct = createAsyncThunk(
    'products/fetchImageProduct',
    async () => {
        try {
            const productsRef = collection(db, "products");
            const querySnapshot = await getDocs(productsRef);

            const docs = querySnapshot.docs.map((doc) => 
                ({id:doc.id, ...doc.data()})
            );

            return docs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)

// Create Product
export const uploadProduct = createAsyncThunk(
    'admin/uploadProduct',
    async () => {
        const response = await axios.post(`${VITE_FUTURA_API}/products`);
        return response.data;
    }
)

export const uploadProductImage = createAsyncThunk(
    'admin/uploadProductImage',
    async ({sku, file}) => {
        try {
            let imageUrl = "";

            if (file != null) {
                const imageRef = ref(storage, `products/${file.name}`);
                const response = await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(response.ref);
            }

            const prodRef = doc(db, `products/${sku}`);
            await setDoc(prodRef, {imageUrl})

            const product = {
                id: sku,
                imageUrl
            }

            return product;
        } catch (error) {
            console.error("Upload Image in product has received an error: ", error);
            throw error;
        }
    }
);

// Fetch Category =================================== >

export const fetchCategory = createAsyncThunk(
    'users/fetchCategory',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/categories`);
        return response.data;
    }
);

// Fetch Product's Data (Type and Variation) =================================== >

export const fetchProductItem = createAsyncThunk(
    'users/fetchProductItem',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/variation/${id}`);
        return response.data;
    }
);

export const fetch_ProductVariation = createAsyncThunk(
    'users/fetch_ProductVariation',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/variations`);
        return response.data;
    }
);

const productsSlice = createSlice({
    name: "productsSlice",
    initialState: {
        products: [],

        productItem: [],
        itemVariation: [],

        categories: [],
        products_loading: false,
        productItem_loading: false,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        // Fetch all users
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                console.log("Products: ", action.payload);
                state.products = action.payload;
                state.products_loading = false;
            })
            .addCase(fetchProducts.pending, (state) => {
                state.products_loading = true;
            });

        builder
            .addCase(fetchImageProduct.fulfilled, (state, action) => {
                state.products = state.products.map(item => {
                    const found = action.payload.find(d => d.id == item.sku )
                    return {
                        ...item,
                        imageUrl: found ? found.thumbnail_url : "NONE"
                    };
                });
            })

        builder
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
        
        builder
            .addCase(fetchProductItem.fulfilled, (state, action) => {
                console.log("Item: ", action.payload);
                state.productItem = action.payload;
                state.productItem_loading = false;
            })
            .addCase(fetchProductItem.pending, (state) => {
                state.productItem_loading = true;
            });

        builder
            .addCase(fetch_ProductVariation.fulfilled, (state, action) => {
                console.log("Fetch Product Variation: ", action.payload);
                state.itemVariation = action.payload;
                state.productItem_loading = false;
            })
            .addCase(fetch_ProductVariation.pending, (state) => {
                state.productItem_loading = true;
            });

    },
});

export default productsSlice.reducer;