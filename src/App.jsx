import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";
import { Provider } from "react-redux";
import { useContext } from "react";

//Page Import ================>
import Homepage from "./pages/Homepage";
import { 
  CartPage, CategoryPage, OrderPage, 
  OrderReceiptPage, ProductPage, 
  ProfilePage, PromotionPage, WishlistPage
} from "./pages/shop";

import {
  CheckoutPage, 
  SuccessPage, FailedPage 
} from "./pages/payment";

import { Admin_DashboardPage, Admin_OrderPage, Admin_ProductPage } from "./pages/admin";
import { LoginPage, SignupPage } from "./pages/auth";

// Import Component ================>
import { Header } from "./components/navigation";

//Rehydration ================>
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

function App() {
  const { currentUser } = useContext(AuthContext) || null;

  return (
    < >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>

          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="*"            element={<Homepage />} />
              <Route path="/Homepage"    element={<Homepage />} />
              <Route path="/Category"    element={<CategoryPage />} />
              <Route path="/Promotion"   element={<PromotionPage />} />
              <Route path="/Product/:id" element={<ProductPage />} />

              <Route path="/Cart"        element={<CartPage />} />
              {!currentUser && (
                < >
                  <Route path="/Login"   element={<LoginPage />} />
                  <Route path="/Signup"  element={<SignupPage />} />
                </>
              )}
              
              {currentUser && (
                < >
                  <Route path="/Wishlist"   element={<WishlistPage />} />
                  <Route path="/Profile"    element={<ProfilePage />} />
                  <Route path="/Order"      element={<OrderPage />} />
                  <Route path="/Order/:id"  element={<OrderReceiptPage />} />

                  <Route path="/Checkout"   element={<CheckoutPage />} />
                  <Route path="/Checkout/Success/:addressID"  element={<SuccessPage />} />
                  <Route path="/Checkout/Failed"  element={<FailedPage />} />
                </>
              )}

              {currentUser && (
                < >
                  <Route path='/Admin'            element={<Admin_DashboardPage /> } />
                  <Route path='/Admin/Products'   element={<Admin_ProductPage />} />
                  <Route path='/Admin/Orders'     element={<Admin_OrderPage />} />
                </>
              )}
            </Routes>
          </BrowserRouter>

        </PersistGate>
      </Provider>
    </>
  ) 
}

export default App
