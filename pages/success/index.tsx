import Link from "next/link";
import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";

const Success = () => {
  const { setCartItems } = useCart();

  useEffect(() => {
    const getStripeSessionId = async () => {
      const response = await fetch("/api/getStripeSession");
      const data = await response.json();
      // Use session data as needed here
      console.log(data); // For demonstration, logs fetched session data

      // Clear cart items after successful order
      setCartItems([]);
    };

    getStripeSessionId();
  }, [setCartItems]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-10 rounded-lg text-center flex gap-10 flex-col">
        <h1 className="text-6xl">Success!!</h1>
        <h2 className="text-3xl">Thank you for your order!</h2>
        <Link href="/">
          <button className="bg-blue-500 text-white p-3 rounded-lg border border-purple-100 shadow-sm">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
