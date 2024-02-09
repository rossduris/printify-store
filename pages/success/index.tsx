import Link from "next/link";
import React from "react";

const Success = () => {
  const getStripeSessionId = async () => {
    const response = await fetch("/api/getStripeSession");
    const data = await response.json();
    return data;
  };

  const sessionItems = getStripeSessionId() as any;

  return (
    <div className=" flex justify-center items-center min-h-screen ">
      <div className=" bg-white p-10 rounded-lg text-center flex gap-10 flex-col">
        <h1 className=" text-6xl">Success!!</h1>
        <h2 className=" text-3xl">Thank you for your order!</h2>
        <button className=" bg-blue-500 text-white p-3 rounded-lg border border-purple-100 shadow-sm">
          <Link href="/">Continue Shopping</Link>
        </button>
      </div>
    </div>
  );
};

export default Success;
