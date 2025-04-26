import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import addressReducer from "./features/addressSlice";
import cartsReducer from "./features/cartsSlice";
import ordersReducer from "./features/orderedSlice";
import paymentsReducer from "./features/paymentSlice";
import productsReducer from "./features/productSlice";
import promotionsReducer from "./features/promotionSlice";
import reviewsReducer from "./features/reviewSlice";
import wishlistsReducer from "./features/wishlistSlice";

const store = configureStore({
    reducer: {
        users: usersReducer,
        address: addressReducer,
        carts: cartsReducer,
        orders: ordersReducer,
        payments: paymentsReducer,
        products: productsReducer,
        promotions: promotionsReducer,
        reviews: reviewsReducer,
        wishlists: wishlistsReducer,
    }
});

export default store;