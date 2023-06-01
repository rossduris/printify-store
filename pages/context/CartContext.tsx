import { CartContextType, CartItem, Item } from "@/types";
import { createContext, useContext, useState, useEffect } from "react";

const initValue = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItem: (id: string, quantity: number) => {},
};

const CartContext = createContext<CartContextType>(initValue);

export const CartProvider = ({
  children,
  initialItems,
}: {
  children: React.ReactNode;
  initialItems: Item[];
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialItems.map((item) => ({ ...item, quantity: 1 }))
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setCartItems(JSON.parse(storedItems) as CartItem[]);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems, isMounted]);

  const addItem = (item: Item) => {
    console.log(item);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.variant_id === item.variant_id
      );
      if (existingItem) {
        // Increment quantity of existing item.
        return prevItems.map((i) =>
          i.id === item.id && i.variant_id === item.variant_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Add new item with quantity 1 and set its price and variant_id.
        return [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            price: item.price,
            variant_id: item.variant_id,
            blueprint_id: item.blueprint_id,
            printprovider_id: item.print_provider_id,
            image: item.image,
          },
        ];
      }
    });
  };

  const updateItem = (id: string, variant_id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.variant_id === variant_id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (id: string, variant_id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && item.variant_id === variant_id)
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ items: cartItems, addItem, removeItem, updateItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
