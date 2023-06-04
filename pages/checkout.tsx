import React from "react";
import Checkout from "./components/ShippingForm";
import { useCart } from "./context/CartContext";
import ShoppingCart from "./components/ShoppingCart";
import ShippingForm from "./components/ShippingForm";
import CartReview from "./components/CartReview";

const CheckoutPage = () => {
  const { items } = useCart();
  return (
    <>
      <h1 className="text-4xl font-bold p-10 ">Planet Cyborg</h1>

      <ShippingForm />
    </>
  );
};

export default CheckoutPage;
