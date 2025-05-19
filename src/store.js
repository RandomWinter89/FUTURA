import { configureStore, combineReducers  } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//Features
import usersReducer from "./features/usersSlice";
import addressReducer from "./features/addressSlice";
import cartsReducer from "./features/cartsSlice";
import ordersReducer from "./features/orderedSlice";
import productsReducer from "./features/productSlice";
import reviewsReducer from "./features/reviewSlice";
import wishlistsReducer from "./features/wishlistSlice";

//reducer
const reducers = combineReducers({
    users: usersReducer,
    address: addressReducer,
    carts: cartsReducer,
    orders: ordersReducer,
    products: productsReducer,
    reviews: reviewsReducer,
    wishlists: wishlistsReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["users", "carts", "wishlists"]
  };

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)  => 
        getDefaultMiddleware({
            serializableCheck: {
            // 👇 Ignore redux-persist actions
            ignoredActions: [
                'persist/PERSIST',
                'persist/REHYDRATE',
                'persist/PAUSE',
                'persist/FLUSH',
                'persist/PURGE',
                'persist/REGISTER',
            ]
        },
    }),
});

export const persistor = persistStore(store);