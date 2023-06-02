import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const { items, updateItem, removeItem } = useCart();
  const [cartVisible, setCartVisible] = useState(false);

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  const getTotalPrice = () => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <>
      <div
        onClick={toggleCart}
        className={`${
          cartVisible ? "block" : " hidden"
        } w-full h-screen bg-black opacity-50 z-50 fixed top-0 left-0 transition-all duration-[.25] cursor-pointer`}
      ></div>
      <div
        className={`z-50 text-center pt-2 fixed right-0  min-h-screen h-full transition-all duration-1`}
      >
        <div
          onClick={toggleCart}
          className="absolute bg-white top-6 px-4 right-10 z-50 cursor-pointer p-1 border border-gray-400 h-10 flex justify-center items-center select-none rounded-full"
        >
          {!cartVisible ? `Cart: ${items.length}` : "X"}
        </div>

        <div
          className={`${
            !cartVisible ? "cartShow" : "cartHide"
          } bg-white right-0 w-[400px] min-h-12 absolute top-0 overflow-scroll shadow-xl h-[100vh]`}
        >
          <h3 className="text-2xl font-bold w-full p-6">
            Cart: {items.length} Items
          </h3>

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
            <div>Total Price: ${getTotalPrice()}</div>
            {items.length > 0 ? (
              <a className=" $ btn btn-primary" href="/checkout">
                Checkout
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
