import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//Features
import usersReducer from "./features/usersSlice";
import addressReducer from "./features/addressSlice";
import cartsReducer from "./features/cartsSlice";
import ordersReducer from "./features/orderedSlice";
import paymentsReducer from "./features/paymentSlice";
import productsReducer from "./features/productSlice";
import promotionsReducer from "./features/promotionSlice";
import reviewsReducer from "./features/reviewSlice";
import wishlistsReducer from "./features/wishlistSlice";

//reducer
const rootReducer = combineReducers({
    users: usersReducer,
    address: addressReducer,
    carts: cartsReducer,
    orders: ordersReducer,
    payments: paymentsReducer,
    products: productsReducer,
    promotions: promotionsReducer,
    reviews: reviewsReducer,
    wishlists: wishlistsReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["users", "carts", "wishlists"] // ← only persist these slices
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

// export default store;
export const persistor = persistStore(store);