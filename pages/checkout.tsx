import React from "react";
import Checkout from "./components/Checkout";
import { useCart } from "./context/CartContext";

const CheckoutPage = () => {
  const { items } = useCart();
  return (
    <>
      <h1>Checkout Page</h1>
      <div>{items ? JSON.stringify(items) : "No Items"}</div>
      <Checkout />
    </>
  );
};

export default CheckoutPage;
