import { CartItem } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const { items, updateItem, removeItem } = useCart();
  const [cartOpacity, setCartOpacity] = useState("opacity-100");
  const [cartVisible, setCartVisible] = useState(false);

  // useEffect(() => {
  //   flashCartOpacity();
  // }, [items]);

  const flashCartOpacity = () => {
    setCartOpacity("opacity-50");
    setTimeout(() => {
      setCartOpacity("opacity-100");
    }, 100);
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  return (
    <div
      className={`z-50 text-center pt-2 fixed ${cartOpacity} transition-all duration-1`}
    >
      <div className="absolute bg-white -top-20 right-0 w-80 min-h-12 shadow-xl">
        <h3 className="text-lg font-bold w-full">Cart</h3>
        <div
          onClick={toggleCart}
          className="transition-all duration-1 rotate-180 absolute top-2 right-5 cursor-pointer p-1 border border-gray-400 w-6 h-6 flex justify-center items-center select-none rounded-full"
        >
          {cartVisible ? "X" : "^"}
        </div>
        <div className={cartVisible ? "block" : "hidden"}>
          {items.length ? (
            items.map((item: CartItem) => (
              <div
                className="border border-gray-300 p-2 m-2 rounded-lg flex items-center gap-6"
                key={item.id}
              >
                <div>{item.name}</div>
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
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
