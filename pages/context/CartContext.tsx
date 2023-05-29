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
  updateItem: (id: string, quantity: number) => void; // new function
};

const initValue = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItem: (id: string, quantity: number) => {}, // new function
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
  const [isMounted, setIsMounted] = useState(false);

  // Load items from local storage when component mounts
  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setCartItems(JSON.parse(storedItems) as Item[]);
    }
    setIsMounted(true); // Set isMounted to true after the initial render
  }, []);

  // Save items to local storage whenever cartItems changes
  useEffect(() => {
    // If the component is not mounted, do not save to localStorage
    if (!isMounted) return;

    // If the component is mounted, save to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems, isMounted]);

  const addItem = (item: Item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
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
