import { createContext, useContext, useState, useEffect } from "react";

export type Item = {
  id: string;
  name: string;
  price: number;
};

type CartContextType = {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
};

const initValue = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
};

const CartContext = createContext<CartContextType>(initValue);

export const CartProvider = ({
  children,
  initialItems,
}: {
  children: React.ReactNode;
  initialItems: Item[];
}) => {
  const [cartItems, setCartItems] = useState<Item[]>(initialItems);

  // Load items from local storage when component mounts
  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setCartItems(JSON.parse(storedItems) as Item[]);
    }
  }, []);

  // Save items to local storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item: Item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ items: cartItems, addItem, removeItem }}>
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
