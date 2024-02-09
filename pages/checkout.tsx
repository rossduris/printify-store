import React from "react";
import ShippingForm from "./components/ShippingForm";
import Link from "next/link";

const CheckoutPage = () => {
  return (
    <>
      <h1 className="text-4xl font-bold p-10 ">
        <Link href="/">Planet Cyborg</Link>
      </h1>

      <ShippingForm />
    </>
  );
};

export default CheckoutPage;
