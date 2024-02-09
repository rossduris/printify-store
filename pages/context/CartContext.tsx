import {
  CartContextType,
  CartItem,
  CartProviderProps,
  HandlingTime,
  Item,
} from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
} from "react";
import useShippingCost from "../hooks/useShippingCost";

const initValue: CartContextType = {
  items: [],
  addItem: (item: Item) => {},
  removeItem: (id: string, variant_id: number) => {},
  updateItem: (id: string, variant_id: number, newQuantity: number) => {},
  calculateShipping: async (country: string, cartItems: CartItem[]) => {
    return {
      totalShippingCost: "",
      handlingTimesByProvider: {},
    };
  },
  getShippingInfo: async (item: CartItem, country: string) => undefined,
  getTotalPrice: () => "",
  selectedCountry: "",
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => {},
  shippingCost: "",
  shippingCostsByProvider: {},
  handlingTimesByProvider: {},
  totalItems: 0,
};

const CartContext = createContext<CartContextType>(initValue);

export const CartProvider = ({ children, initialItems }: CartProviderProps) => {
  const [handlingTimesByProvider, setHandlingTimesByProvider] = useState<{
    [key: string]: HandlingTime;
  }>({});
  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialItems.map((item) => ({ ...item, quantity: 1 }))
  );
  const [isMounted, setIsMounted] = useState(false);
  const [shippingCostsByProvider, setShippingCostsByProvider] = useState<{
    [key: string]: string;
  }>({});
  const { getShippingInfo, calculateShipping } = useShippingCost();
  const [shippingCost, setShippingCost] = useState<string>("");

  const calculateAndSetShippingCost = async () => {
    const shippingInfo = await calculateShipping(selectedCountry, cartItems);
    setShippingCost(shippingInfo.totalShippingCost);
    setHandlingTimesByProvider(shippingInfo.handlingTimesByProvider);
  };

  const calculateAndSetShippingCostsByProvider = async () => {
    const costs: { [key: string]: string } = {};
    for (const item of cartItems) {
      // Get the provider ID for each item (assuming it's a string)
      const providerId = item.print_provider_id.toString();

      // Calculate the shipping cost for the item
      const costInfo = await calculateShipping(selectedCountry, [item]);

      // If the provider ID is already in the costs object, add the new cost to the existing cost
      if (providerId in costs) {
        costs[providerId] = (
          parseFloat(costs[providerId]) + parseFloat(costInfo.totalShippingCost)
        ).toFixed(2);
      } else {
        // Otherwise, set the cost for the provider ID
        costs[providerId] = costInfo.totalShippingCost;
      }
      setHandlingTimesByProvider(costInfo.handlingTimesByProvider);
    }

    // Set the new shipping costs by provider
    setShippingCostsByProvider(costs);
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Load initial country from localStorage or default to 'US'
  let initialCountry;
  try {
    initialCountry = localStorage.getItem("selectedCountry") || "US";
  } catch {
    initialCountry = "";
  }

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems) as CartItem[];
      setCartItems(parsedItems);
    }
    const storedShippingCost = localStorage.getItem("shippingCost");
    if (storedShippingCost) {
      setShippingCost(storedShippingCost);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("shippingCost", shippingCost);

    if (shippingCost === "") {
      // Only fetch initial shipping cost if it hasn't been calculated yet
      calculateAndSetShippingCost();
    }

    if (cartItems.length > 0) {
      calculateAndSetShippingCost();
    }

    calculateAndSetShippingCostsByProvider();
  }, [selectedCountry, cartItems, isMounted, shippingCost]);

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    // calculateShipping(newCountry);

    try {
      localStorage.setItem("selectedCountry", newCountry);
    } catch {
      // Ignore any localStorage errors
    }
  };

  //Test this addItem code ..
  // const addItem = (item: Item) => {
  //   setCartItems((prevItems) => {
  //     // Check if item already exists in the cart
  //     const existingItemIndex = prevItems.findIndex(
  //       (prevItem) =>
  //         prevItem.product_id === item.product_id &&
  //         prevItem.variant_id === item.variant_id
  //     );

  //     // If it does, increase its quantity
  //     if (existingItemIndex > -1) {
  //       const newItems = [...prevItems];
  //       newItems[existingItemIndex].quantity =
  //         (newItems[existingItemIndex].quantity || 0) + 1;
  //       return newItems;
  //     }

  //     // If it doesn't, add it to the cart with quantity 1
  //     return [...prevItems, { ...item, quantity: 1 }];
  //   });
  // };
  //look into for why it occured

  const addItem = (item: Item) => {
    setCartItems((prevItems) => {
      let itemExists = false;

      const newItems = prevItems.map((prevItem) => {
        if (
          prevItem.product_id === item.product_id &&
          prevItem.variant_id === item.variant_id
        ) {
          itemExists = true;
          return {
            ...prevItem,
            quantity: (prevItem.quantity || 0) + 1,
          };
        }
        return prevItem;
      });

      if (!itemExists) {
        newItems.push({ ...item, quantity: 1 });
      }

      return newItems;
    });
  };
  const updateItem = (
    product_id: string,
    variant_id: number,
    newQuantity: number
  ) => {
    setCartItems((prevItems) => {
      // Find the item to update
      const itemIndex = prevItems.findIndex(
        (item) =>
          item.product_id === product_id && item.variant_id === variant_id
      );

      if (itemIndex === -1) {
        // If the item doesn't exist, just return the previous state.
        return prevItems;
      }

      // Create a new item with the updated quantity
      const updatedItem = {
        ...prevItems[itemIndex],
        quantity: newQuantity,
      };

      // Create a new array with the updated item
      const newItems = [
        ...prevItems.slice(0, itemIndex),
        updatedItem,
        ...prevItems.slice(itemIndex + 1),
      ];

      return newItems;
    });
  };
  const removeItem = (product_id: string, variant_id: number) => {
    setCartItems((prevItems) => {
      // Filter out the item to be removed
      const newItems = prevItems.filter(
        (item) =>
          !(item.product_id === product_id && item.variant_id === variant_id)
      );

      // If all items have been removed, set shipping cost to zero
      if (newItems.length === 0) {
        setShippingCost("0.00");
      }

      return newItems;
    });
  };
  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = item.price;
        return total + itemPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        totalItems,
        selectedCountry,
        handleCountryChange,
        items: cartItems,
        addItem,
        removeItem,
        updateItem,
        calculateShipping,
        getShippingInfo,
        getTotalPrice,
        shippingCost,
        shippingCostsByProvider,
        handlingTimesByProvider,
      }}
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
