import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import {
  CustomerProvider
} from "./context/CustomerContext";

import {
  CartProvider
} from "./context/CartContext";

import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <CustomerProvider>

      <CartProvider>

        <App />

      </CartProvider>

    </CustomerProvider>

  </React.StrictMode>

);