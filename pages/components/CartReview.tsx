import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import getStripe from "../utils/stripe";

type CartReviewProps = {
  children: React.ReactNode;
};

const CartReview = ({ children }: CartReviewProps) => {
  const {
    items,
    updateItem,
    removeItem,
    getShippingInfo,
    calculateShipping,
    getTotalPrice,
  } = useCart();

  return (
    <div>
      <div className=" bg-white  shadow-xl rounded-xl p-4 mx-8">
        <h3 className="text-lg font-bold w-full">Order Summary</h3>

        <div>
          {items.length ? (
            items.map((item: CartItem) => (
              <div
                className="border border-gray-300 p-2 m-2 rounded-lg flex items-center gap-6"
                key={item.id + item.variant_id}
              >
                <div>
                  <img src={item.image} className=" w-24 h-24" />
                  <div>{item.name}</div>
                  <div>${item.price}</div>
                  <div>shipping: ${item.shippingCost}</div>
                  <div>variant: {item.variant_id}</div>
                  <div>blueprint: {item.blueprint_id}</div>
                  <div>id:{item.id}</div>
                </div>
                <select
                  className="rounded-md px-1 h-8 bg-slate-100 border border-slate-200 text-slate-500"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    if (newQuantity > 0) {
                      updateItem(item.id, item.variant_id, newQuantity);
                      calculateShipping(e.target.value);
                    } else {
                      removeItem(item.id, item.variant_id);
                    }
                  }}
                >
                  {[...Array(10).keys()].map((value) => (
                    <option key={value + 1} value={value + 1}>
                      {value + 1}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeItem(item.id, item.variant_id)}>
                  X
                </button>
              </div>
            ))
          ) : (
            <div>No items</div>
          )}
          {getTotalPrice() !== null ? (
            <>
              <div className=" p-4 text-xl rounded-lg mt-6 text-gray-600 flex justify-center">
                Total Price: ${Number(getTotalPrice())}
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
