import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { collection, updateDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ---------------------------------------------------------


//Fetch product (data)
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/products`);
        return response.data;
    }
);

//Fetch product (image)
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

// == CREATE/UPLOAD =================

//Create product (data)
export const uploadProduct = createAsyncThunk(
    'admin/uploadProduct',
    async () => {
        const response = await axios.post(`${VITE_FUTURA_API}/products`);
        return response.data;
    }
)

//Create product (image)
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

            const prodRef = doc(db, `products`);
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

// == UPDATE =======================

//Update product (data - quantity edition)
// export const updateProduct_Data = createAsyncThunk(
//     'admin/updateProduct_Data',
//     async ({}) => {
//         const response = await axios.put(`${VITE_FUTURA_API}/products`);
//         return response.data;
//     }
// )

//Update product (image - new display)
export const updateProduct_Image = createAsyncThunk(
    async ({ prodID, newFile }) => {
        try {
            let newImageUrl;

            if (newFile != null) {
                const imageRef = ref(storage, `products/${newFile.name}`);
                const response = await uploadBytes(imageRef, newFile);
                newImageUrl = await getDownloadURL(response);
            }

            const prodRef = doc(db, `products/${prodID}`);
            const prodSnap = await getDoc(prodRef);

            if (prodSnap.exists()) {
                const prodData = prodSnap.data();

                const updatedData = {
                    ...prodData,
                    imageUrl: newImageUrl || prodData.imageUrl,
                };

                await updateDoc(prodRef, updatedData);

                const updProd = { id: prodID, ...updatedData };
                return updProd;
            } else {
                throw new Error("Product does not exist");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)


// Fetch Product's Data (Type and Variation) =================================== >
export const fetchProductItem = createAsyncThunk(
    'products/fetchProductItem',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/variation/${id}`);
        return response.data;
    }
);

export const fetch_ProductVariation = createAsyncThunk(
    'products/fetch_ProductVariation',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/variations`);
        return response.data;
    }
);


// ---------------------------------------------------------


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