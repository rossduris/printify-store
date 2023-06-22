import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

type CartReviewProps = {
  children: React.ReactNode;
};

const CartReview = ({ children }: CartReviewProps) => {
  const {
    items,
    updateItem,
    removeItem,

    calculateShipping,
    getTotalPrice,
    selectedCountry,
  } = useCart();

  const [shippingCost, setShippingCost] = useState("0.00");

  useEffect(() => {
    const fetchShippingCost = async () => {
      const newShippingCost = await calculateShipping(selectedCountry, items);
      setShippingCost(newShippingCost);
    };

    fetchShippingCost();
  }, [selectedCountry, items]);

  const groupedItems: Map<string, CartItem> = items.reduce((acc, item) => {
    const key = `${item.product_id}_${item.variant_id}`;
    if (acc.has(key)) {
      const existingItem = acc.get(key);
      existingItem!.quantity += 1;
    } else {
      acc.set(key, { ...item, quantity: 1 });
    }
    return acc;
  }, new Map<string, CartItem>());

  const cartItems: CartItem[] = Array.from(groupedItems.values());

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
              <div className="cartSummary">
                <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600">
                  <span>Items:</span> <span>${Number(getTotalPrice())}</span>
                </div>
                <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600 border-b border-gray-200">
                  <span> Shipping & Handling:</span>
                  <span> ${shippingCost}</span>
                </div>

                <div className=" p-1 text-sm mt-2 text-gray-600 ">
                  <span>Total before tax: </span>
                  <span>${Number(getTotalPrice()) + Number(shippingCost)}</span>
                </div>

                <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600">
                  <span>Estimated tax to be collected: </span>
                  <span>${(Number(getTotalPrice()) * 0.08).toFixed(2)}</span>
                </div>

                <div className=" p-1 text-lg pt-8 mt-6 text-gray-600 border-t broder-gray-200">
                  <span> Order total: </span>
                  <span>
                    $
                    {(
                      Number(getTotalPrice()) +
                      Number(shippingCost) +
                      Number(getTotalPrice()) * 0.08
                    ).toFixed(2)}
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
