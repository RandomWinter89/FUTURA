
import { BrowserRouter, Outlet, Link, Route, Routes, useNavigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthProvider";
import { Provider } from "react-redux";
// import store from "./store";

// import Homepage from "./pages/Homepage";

import Homepage from "./pages/Homepage";

import Profile from "./pages/User/Profile";

import SignupPage from "./pages/Authentication/Signup";
import LoginPage from "./pages/Authentication/Login";
import RegisterForm from "./pages/Authentication/RegisterForm";

import PromotionPage from "./pages/Register/Promotion";

import { getAuth } from "firebase/auth";

import { useSelector } from "react-redux";
import { AuthContext } from "./Context/AuthProvider";
import { useEffect, useContext } from "react";

import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext) || null;
  const { personal } = useSelector((state) => state.users);

  const auth = getAuth();
  const handleLogout = () => auth.signOut();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentUser && personal.length)


  //   if (!currentUser || personal.length == 0)
  //     navigate("Login");
  // }, [navigate, currentUser, personal])

  return (
    < >
      <div className="py-4 px-2 bg-black text-white flex gap-4">
        <Link to="/Login">Login</Link>
        <Link to="/Signup">Signup</Link>
        <Link to="/Homepage">Homepage</Link>
        <Link to="/Promotion">Promotion</Link>
        {currentUser && <Link to="/Profile">Profile</Link>}

        {currentUser && <button onClick={handleLogout}>Exit</button>}
      </div>
      <Outlet />
    </>
  )
}

function App() {

  return (
    <AuthProvider>
      {/* Redux Storage */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* Router */}
          <BrowserRouter>
            <Navbar />

            <Routes>
              {/* <Route path="*" element={<Homepage/>} /> */}
              <Route path="*" element={<Homepage />} />
              <Route path="/Login" element={<LoginPage/>} />
              <Route path="/Signup" element={<SignupPage/>} />
              <Route path="/Signup2" element={<RegisterForm />} />

              <Route path="/Homepage" element={<Homepage />} />
              <Route path="/Promotion" element={<PromotionPage />} />
              <Route path="/Profile" element={<Profile />} />

              {/* Homepage */}
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </AuthProvider>
  ) 
}

export default App
