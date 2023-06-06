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
    selectedCountry,
    handleCountryChange,
  } = useCart();

  const [shippingCost, setShippingCost] = useState("0.00");

  useEffect(() => {
    const fetchShippingCost = async () => {
      const newShippingCost = await calculateShipping(selectedCountry, items);
      setShippingCost(newShippingCost);
    };

    fetchShippingCost();
  }, [selectedCountry, items]);

  return (
    <div>
      <div className=" bg-white  shadow-xl rounded-xl p-4 mx-8">
        <h3 className="text-lg font-bold w-full">Order Summary</h3>

        <div>
          {items.length ? (
            items.map((item: CartItem) => (
              <div
                className="border border-gray-300 p-2 rounded-lg flex items-center gap-6"
                key={item.product_id + item.variant_id}
              >
                <div>
                  <img src={item.image} className=" w-24 h-24" />
                  <div>{item.product_id}</div>
                  <div>{item.name}</div>
                  <div>${item.price}</div>
                  <div>{item.variant_id}</div>
                  <div>{item.blueprint_id}</div>
                </div>
                <select
                  className="rounded-md px-1 h-6 bg-slate-200 border border-slate-300 text-slate-500"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    if (newQuantity > 0) {
                      updateItem(item.product_id, item.variant_id, newQuantity);
                    } else {
                      removeItem(item.product_id, item.variant_id);
                    }
                  }}
                >
                  {[...Array(10).keys()].map((value) => (
                    <option key={value + 1} value={value + 1}>
                      {value + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeItem(item.product_id, item.variant_id)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <div>No items</div>
          )}
          {getTotalPrice() !== null ? (
            <>
              <div className=" p-4 text-xl rounded-lg mt-2 text-gray-600">
                Shipping: ${shippingCost}
              </div>

              <div className=" p-4 text-xl rounded-lg mt-6 text-gray-600">
                Total Price: ${Number(getTotalPrice()) + Number(shippingCost)}
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
