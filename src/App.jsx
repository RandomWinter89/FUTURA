import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";
import { Provider } from "react-redux";
// import store from "./store";

//Page ================>
import Homepage from "./pages/Homepage";
import Profile from "./pages/User/Profile";

import LoginPage from "./pages/Authentication/Login";
import SignupPage from "./pages/Authentication/Signup";
import RegisterForm from "./pages/Authentication/RegisterForm";

import PromotionPage from "./pages/Register/Promotion";
import ProductPage from "./pages/NonRegister/Products";
import CategoryPage from "./pages/NonRegister/Category";

import WishlistPage from "./pages/Register/Wishlist";
import CartPage from "./pages/NonRegister/Cart";

// Import Component ================>
import Navbar from "./components/Navbar/Navbar";

// Import database ================>
import { useContext } from "react";

//Rehydration ================>
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";


function App() {
  const { currentUser } = useContext(AuthContext) || null;

  return (
    <>
      {/* Redux Storage */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* Router */}
          <BrowserRouter>
            <Navbar />

            <Routes>
              <Route path="*" element={<Homepage />} />
              <Route path="/Login" element={<LoginPage/>} />
              <Route path="/Signup" element={<SignupPage/>} />
              {currentUser && <Route path="/RegisterForm" element={<RegisterForm />} />}
              {currentUser && <Route path="/Wishlist" element={<WishlistPage/>} />}
              <Route path="/Cart" element={<CartPage />} />
              {/* {currentUser && <Route path="/Checkout" element={} />/>}
              {currentUser && <Route path="/Orders" element={} />/>} */}

              <Route path="/Homepage" element={<Homepage />} />
              <Route path="/Promotion" element={<PromotionPage />} />
              <Route path="/Category" element={<CategoryPage /> } />
              {currentUser && <Route path="/Profile" element={<Profile />} />}
              <Route path="/Product/:id" element={<ProductPage />} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  ) 
}

export default App
