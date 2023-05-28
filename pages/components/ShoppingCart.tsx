import { CartItem, Item, ShoppingCartProps } from "@/types";
import React from "react";

const ShoppingCart = ({ items }: ShoppingCartProps) => {
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

  return (
    <div className="bg-white w-40 text-center pt-2 relative">
      <h3>Cart</h3>
      <div className="absolute bg-white top-8 right-0 w-40">
        <h4>Items</h4>
        {cartItems.length ? (
          cartItems.map((item: CartItem) => (
            <div key={item.id}>
              {item.name}, {item.id} (Quantity: {item.quantity})
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
