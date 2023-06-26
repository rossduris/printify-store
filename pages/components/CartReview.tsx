import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import PrintProviderGroup from "./PrintProviderGroup";
import { TrashIcon } from "@heroicons/react/24/solid";
import { loadStripe } from "@stripe/stripe-js";

type CartReviewProps = {
  children: React.ReactNode;
};

const CartReview = ({ children }: CartReviewProps) => {
  const {
    items,
    updateItem,
    removeItem,
    handleCountryChange,
    calculateShipping,
    getTotalPrice,
    selectedCountry,
    shippingCost, // Get shippingCost from useCart
  } = useCart();

  return (
    <div>
      <div className=" bg-white  shadow-xl rounded-xl p-4 mx-8">
        <h3 className="text-lg font-bold w-full">Order Summary</h3>

        <div>
          {items.length ? (
            // Use PrintProviderGroup component to display cart items
            <PrintProviderGroup items={items} />
          ) : (
            <div>No items</div>
          )}
          {getTotalPrice() !== null ? (
            <>
              <div className="cartSummary">
                <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600">
                  <span>Items:</span> <span>${Number(getTotalPrice())}</span>
                </div>
                <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600 border-b border-gray-200">
                  <span> Shipping & Handling:</span>
                  <span> ${Number(shippingCost).toFixed(2)}</span>
                </div>

                <div className=" p-1 text-sm mt-2 text-gray-600 ">
                  <span>Subtotal: </span>
                  <span>
                    $
                    {(Number(getTotalPrice()) + Number(shippingCost)).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-center mt-8 h-20">
                {children}
              </div>
            </>
          ) : (
            <div>
              Please enter your shipping information to calculate the total
              cost.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartReview;
