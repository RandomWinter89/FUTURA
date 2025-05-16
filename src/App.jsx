import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";

//Page Import ================>

import Homepage from "./pages/Homepage";
import { 
  CartPage, CategoryPage, OrderPage, 
  OrderReceiptPage, ProductPage, 
  ProfilePage, WishlistPage
} from "./pages/shop";

import {
  CheckoutPage, 
  SuccessPage, FailedPage 
} from "./pages/payment";

import { Admin_DashboardPage, Admin_OrderPage, Admin_ProductPage } from "./pages/admin";
import { LoginPage, RegisterPage, SignupPage } from "./pages/auth";

//Layout ======================>
import { AdminLayout, GeneralLayout } from "./components/common";

//Auth Checker ================>
import AuthChecker from "./components/common/AuthChecker";

//Redux 
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./features/usersSlice";


function App() {
  // isfeedback
  const { currentUser } = useContext(AuthContext) || null;
  const { personal, personal_loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser && !personal?.uid)
      dispatch(fetchProfile(currentUser.uid))
  }, [dispatch, currentUser, personal]);

  return (
    < >
      <Routes>
        <Route path="/" element={<AuthChecker />}/>

        <Route path="/Shop" element={
            <AuthChecker auth_user={currentUser} data_user={personal} loading={personal_loading}>
              <GeneralLayout data_user={personal} />
            </AuthChecker>
          }
        >
          <Route path="Homepage"    element={<Homepage />} />
          <Route path="Category"    element={<CategoryPage />} />
          <Route path="Product/:id" element={<ProductPage />} />
        </Route>

        <Route path="/Auth" element={
            <AuthChecker auth_user={currentUser} data_user={personal} loading={personal_loading}>
              <GeneralLayout data_user={personal}/>
            </AuthChecker>
          }
        >
          <Route path="Login"    element={<LoginPage />} />
          <Route path="Signup"   element={<SignupPage />} />
          <Route path="Register" element={<RegisterPage />} />
        </Route>
        
        <Route path="/User" element={
            <AuthChecker auth_user={currentUser} data_user={personal} loading={personal_loading}>
              <GeneralLayout data_user={personal}/>
            </AuthChecker>
          }
        >
          <Route path="Cart"       element={<CartPage />} />
          <Route path="Wishlist"   element={<WishlistPage />} />
          <Route path="Profile"    element={<ProfilePage />} />
          <Route path="Order"      element={<OrderPage />} />
          <Route path="Order/:id"  element={<OrderReceiptPage />} />

          <Route path="Checkout"   element={<CheckoutPage />} />
          <Route path="Checkout/Failed"  element={<FailedPage />} />
          <Route path="Checkout/Success/:addressID"  element={<SuccessPage />} />
        </Route>

        <Route path="/Admin" element={
            <AuthChecker auth_user={currentUser} data_user={personal} loading={personal_loading}>
              <AdminLayout />
            </AuthChecker>
          }
        >
          <Route path='Dashboard'  element={<Admin_DashboardPage /> } />
          <Route path='Products'   element={<Admin_ProductPage />} />
          <Route path='Orders'     element={<Admin_OrderPage />} />
        </Route>
      </Routes>
    </>
  ) 
}

export default App
