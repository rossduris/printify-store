import { CartItem, Item, ShoppingCartProps } from "@/types";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const { items, updateItem } = useCart();
  const [cartOpacity, setCartOpacity] = useState(`opacity-100`);

  const cartItems: CartItem[] = React.useMemo(() => {
    return items.reduce((accumulator: CartItem[], item: Item) => {
      const existingItem = accumulator.find(
        (i) => i.id === item.id && i.name === item.name
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        accumulator.push({ ...item, quantity: 1 });
      }
      return accumulator;
    }, []);
  }, [items]);

  useEffect(() => {
    flashCartOpacity();
  }, [items]);

  const flashCartOpacity = () => {
    setCartOpacity("opacity-50");

    setTimeout(() => {
      setCartOpacity("opacity-100");
    }, 100);
  };

  return (
    <div
      className={`bg-white z-50 w-40 text-center pt-2 fixed ${cartOpacity} transition-all duration-1`}
    >
      <h3>Cart</h3>
      <div className="absolute bg-white top-8 right-0 w-40">
        <h4>Items</h4>
        {cartItems.length ? (
          cartItems.map((item: CartItem) => (
            <div key={item.id}>
              {item.name}, {item.id}
              <select
                value={item.quantity}
                onChange={(e) => updateItem(item.id, Number(e.target.value))}
              >
                {[...Array(item.quantity + 10).keys()].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))
        ) : (
          <div>No items</div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
