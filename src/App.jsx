import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";

//Page Import ================>

import Homepage from "./pages/Homepage";
import { CategoryPage, ProductPage} from "./pages/shop";
import { CheckoutPage, SuccessPage, FailedPage } from "./pages/payment";
import { CartPage, ProfilePage, WishlistPage} from "./pages/users";

import { Admin_DashboardPage, Admin_OrderPage, Admin_ProductPage } from "./pages/admin";
import { LoginPage, RegisterPage, SignupPage } from "./pages/auth";

//Layout ======================>
import { GeneralLayout } from "./components/shop";
import { AuthLayout } from "./components/common";
import { AdminLayout } from "./components/admin";

//Auth Checker ================>
import AuthChecker from "./components/common/AuthChecker";

//Redux 
import { useDispatch, useSelector } from "react-redux";
import { readCurrentUserProfile } from "./features/usersSlice";


function App() {
  const { currentUser } = useContext(AuthContext) || null;
  const { currentDBUser, currentDBUserStatus } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser && !currentDBUser?.uid)
      dispatch(readCurrentUserProfile(currentUser.uid))
  }, [dispatch]);

  return (
    < >
      <Routes>
        <Route path="/" element={
          <AuthChecker auth_user={currentUser} data_user={currentDBUser} status={currentDBUserStatus}/>}
        />

        <Route path="/Shop" element={
            <AuthChecker auth_user={currentUser} data_user={currentDBUser} status={currentDBUserStatus}>
              <GeneralLayout auth_user={currentUser} />
            </AuthChecker>
          }
        >
          <Route path="Homepage"    element={<Homepage />} />
          <Route path="Category"    element={<CategoryPage />} />
          <Route path="Product/:id" element={<ProductPage />} />
        </Route>

        <Route path="/Auth" element={
            <AuthChecker auth_user={currentUser} data_user={currentDBUser} status={currentDBUserStatus}>
              <AuthLayout />
            </AuthChecker>
          }
        >
          <Route path="Login"    element={<LoginPage />} />
          <Route path="Signup"   element={<SignupPage />} />
          <Route path="Register" element={<RegisterPage />} />
        </Route>
        
        <Route path="/User" element={
            <AuthChecker auth_user={currentUser} data_user={currentDBUser} status={currentDBUserStatus}>
              <GeneralLayout auth_user={currentUser}/>
            </AuthChecker>
          }
        >
          <Route path="Cart"       element={<CartPage />} />
          <Route path="Wishlist"   element={<WishlistPage />} />
          <Route path="Profile"    element={<ProfilePage />} />
          <Route path="Checkout"   element={<CheckoutPage />} />
          <Route path="Checkout/Failed"  element={<FailedPage />} />
          <Route path="Checkout/Success/:addressID"  element={<SuccessPage />} />
        </Route>

        <Route path="/Admin" element={
            <AuthChecker auth_user={currentUser} data_user={currentDBUser} status={currentDBUserStatus}>
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
