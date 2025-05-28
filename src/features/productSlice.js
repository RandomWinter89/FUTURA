import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { collection, updateDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

// ---------------------------------------------------------

//READ PRODUCTS (DATA)
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await axios.get(`${VITE_FUTURA_API}/products`);
        return response.data;
    }
);

//READ PRODUCT (IMAGE)
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

//CREATE PRODUCT (DATA)
export const uploadProduct = createAsyncThunk(
    'admin/uploadProduct',
    async ({category_id, name, description, base_price, sku}) => {
        const body = {category_id, name, description, base_price, sku};
        
        const response = await axios.post(`${VITE_FUTURA_API}/products`, body);
        return response.data;
    }
)

//UPLOAD PRODUCT (IMAGE)
export const uploadProductImage = createAsyncThunk(
    'admin/uploadProductImage',
    async ({sku, prodImg}) => {
        try {
            let thumbnail_url = "";

            if (prodImg != null) {
                const imageRef = ref(storage, `product/${prodImg.name}`);
                const response = await uploadBytes(imageRef, prodImg);
                thumbnail_url = await getDownloadURL(response.ref);
            }

            const prodRef = doc(db, `products/${sku}`);
            await setDoc(prodRef, {thumbnail_url})

            const product = {
                id: sku,
                thumbnail_url: thumbnail_url
            }

            return product;
        } catch (error) {
            console.error("Upload Image in product has received an error: ", error);
            throw error;
        }
    }
);

// == Product Variation =======================
//CREATE PRODUCT VARIATION
export const create_ProdVariation = createAsyncThunk(
    'admin/create_ProdVariation',
    async ({id, optionA_id, optionB_id, quantity, charge}) => {
        const body = { optionA_id, optionB_id, quantity, charge };

        const response = await axios.post(`${VITE_FUTURA_API}/products/${id}/variations`, body);
        return response.data;
    }
)

//UPDATE PRODUCT VARIATION - STOCK
export const update_ProdStock = createAsyncThunk(
    'admin/update_ProdStock',
    async ({id, quantity}) => {
        const body = { quantity };

        const response = await axios.put(`${VITE_FUTURA_API}/products/${id}/variations`, body);
        return response.data;
    }
)

//=============================?

//UPDATE PRODUCT IMAGE
export const updateProduct_Image = createAsyncThunk(
    'admin/updateProduct_Image',
    async ({ prodID, newFile }) => {
        try {
            let newImageUrl;

            if (newFile != null) {
                const imageRef = ref(storage, `product/${newFile.name}`);
                const response = await uploadBytes(imageRef, newFile);
                newImageUrl = await getDownloadURL(response.ref);
            }

            const prodRef = doc(db, `products/${prodID}`);
            const prodSnap = await getDoc(prodRef);

            if (prodSnap.exists()) {
                const prodData = prodSnap.data();

                const updatedData = {
                    ...prodData,
                    thumbnail_url: newImageUrl || prodData.imageUrl,
                };

                await updateDoc(prodRef, updatedData);

                const updProd = { id: prodID, ...updatedData };
                return updProd;
            } else {
                await setDoc(prodRef, {thumbnail_url: newImageUrl});

                const product = {
                    id: prodID,
                    thumbnail_url: newImageUrl
                }

                return product;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)

//UPDATE PRODUCT INFO
export const updateProduct = createAsyncThunk(
    'admin/updateProduct',
    async ({ id, name, description, base_price }) => {
        const body = { name, description, base_price };

        const response = await axios.put(`${VITE_FUTURA_API}/products/${id}`, body);
        return response.data;
    }
);

//READ PRODUCT'S VARIATION
export const fetchProductItem = createAsyncThunk(
    'products/fetchProductItem',
    async (id) => {
        const response = await axios.get(`${VITE_FUTURA_API}/products/variation/${id}`);
        return response.data;
    }
);

//READ PRODUCT VARIATION
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

        productStatus: "idle",
        productVariationStatus: "idle"
    },
    reducers: {
    },
    extraReducers: (builder) => {
        // Fetch all users
        builder
            //CREATE
            .addCase(fetchProducts.pending, (state) => {
                state.productStatus = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.productStatus = "succeed";
            })

            .addCase(create_ProdVariation.fulfilled, (state, action) => {
                state.productItem = [...state.productItem, action.payload.data];
            })

            .addCase(uploadProduct.fulfilled, (state, action) => {
                state.products = [...state.products, action.payload.data];
            })

            .addCase(uploadProductImage.fulfilled, (state, action) => {
                const updatedImage = action.payload;
                state.products = state.products.map(item =>
                    item.sku == updatedImage.id
                        ? { ...item, imageUrl: updatedImage.thumbnail_url }
                        : item
                );
            })

            //READ
            .addCase(fetchImageProduct.fulfilled, (state, action) => {
                state.products = state.products.map(item => {
                    const found = action.payload.find(d => d.id == item.sku )
                    return {
                        ...item,
                        imageUrl: found ? found.thumbnail_url : "NONE"
                    };
                });
            })

            .addCase(fetch_ProductVariation.pending, (state) => {
                state.productVariationStatus = "loading";
            })
            .addCase(fetch_ProductVariation.fulfilled, (state, action) => {
                state.itemVariation = action.payload;
                state.productVariationStatus = "succeed";
            })

            .addCase(fetchProductItem.pending, (state) => {
                state.productItem_loading = true;
                state.productVariationStatus = "loading";
            })
            .addCase(fetchProductItem.fulfilled, (state, action) => {
                state.productItem = action.payload;
                state.productVariationStatus = "succeed";
            })
            .addCase(fetchProductItem.rejected, (state) => {
                state.productItem = [];
                state.productVariationStatus = "failed";
            })
            

            //UPDATE
            .addCase(update_ProdStock.fulfilled, (state, action) => {
                state.productItem = state.productItem.map((prev) => {
                    if (prev.id == action.payload.id)
                        return {...prev, quantity: action.payload.quantity}

                    return prev;
                })
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                state.products = state.products.map((prev) => {
                    if (prev.id == action.payload.id)
                        return {...prev, ...action.payload}

                    return prev;
                })
            })

            .addCase(updateProduct_Image.fulfilled, (state, action) => {
                const updatedImage = action.payload;
                state.products = state.products.map(item =>
                    item.sku == updatedImage.id
                        ? { ...item, imageUrl: updatedImage.thumbnail_url }
                        : item
                );
            });
    },
});

export default productsSlice.reducer;