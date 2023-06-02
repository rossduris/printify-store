import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import getStripe from "../utils/stripe";

const CartReview = () => {
  const { items, updateItem, removeItem } = useCart();

  const getTotalPrice = () => {
    return items
      .reduce((total, item) => {
        const shippingCost = item.shippingCost ? item.shippingCost : 0;
        return total + (item.price + shippingCost) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // modify your getShippingInfo function to return the shipping cost:
  const getShippingInfo = async (item: CartItem, country: string) => {
    try {
      const response = await fetch("/api/printify/get-shipping", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          blueprint_id: item.blueprint_id,
          print_provider_id: item.print_provider_id,
        }),
      });
      const data = await response.json();
      // assume data.profiles[0] is the correct profile and data.profiles[0].first_item.cost / 100 is the shipping cost for the first item:

      return data.profiles[0].first_item.cost / 100;
    } catch (error) {
      console.error("Failed to fetch shipping information:", error);
    }
  };

  // in your calculateShipping function, call updateItem after getting the shipping info:
  const calculateShipping = (country: string) => {
    if (items) {
      items.map((item: CartItem) => {
        getShippingInfo(item, country).then((shippingCost) => {
          // once you've got the shipping cost, update the item in the cart:
          updateItem(item.id, item.variant_id, item.quantity, shippingCost);
        });
      });
    } else {
      console.log("no items yet");
    }
  };

  return (
    <div>
      <div className=" bg-white  min-h-12 shadow-xl rounded-xl p-4">
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
                  className="rounded-md px-1 h-6 bg-slate-100 border border-slate-200 text-slate-500"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    if (newQuantity > 0) {
                      updateItem(item.id, item.variant_id, newQuantity);
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
              <div>Total Price: ${getTotalPrice()}</div>
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
