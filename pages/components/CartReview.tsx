import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const CartReview = () => {
  const { items, updateItem, removeItem } = useCart();

  const getTotalPrice = () => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
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
                  <div>{item.variant_id}</div>
                  <div>{item.blueprint_id}</div>
                  <div>{item.id}</div>
                </div>
                <select
                  className="rounded-md px-1 h-6"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    if (newQuantity > 0) {
                      updateItem(item.id, newQuantity);
                    } else {
                      removeItem(item.id);
                    }
                  }}
                >
                  {[...Array(10).keys()].map((value) => (
                    <option key={value + 1} value={value + 1}>
                      {value + 1}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeItem(item.id)}>X</button>
              </div>
            ))
          ) : (
            <div>No items</div>
          )}
          <div>Total Price: ${getTotalPrice()}</div>
        </div>
      </div>
    </div>
  );
};

export default CartReview;
