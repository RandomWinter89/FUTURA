import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.jsx'
import './index.css'

// Router and Context
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthProvider";

// Payment Plugin
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Persist + Redux Plugin
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Provider } from "react-redux";

// =====================>
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// <StrictMode>
createRoot(document.getElementById('root')).render(
  < >

    {/* PAYMENT PROMISE */}
    <Elements stripe={stripePromise}>

      {/* CONTEXT - USER AUTH */}
      <AuthProvider>

        {/* REDUX - STORE */}
        <Provider store={store}>

          {/* REDUX PERSIST */}
          <PersistGate loading={null} persistor={persistor}>

            {/* ROUTER */}
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </AuthProvider>
    </Elements>
  </>
)

{/* </StrictMode> */}