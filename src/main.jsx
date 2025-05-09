import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.jsx'
import './index.css'

import { AuthProvider } from "./Context/AuthProvider";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Elements>
  </StrictMode>,
)
