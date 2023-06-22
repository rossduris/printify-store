import {
  CartContextType,
  CartItem,
  CartProviderProps,
  Item,
  ShippingProfile,
} from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
} from "react";

const initValue: CartContextType = {
  items: [],
  addItem: (item: Item) => {},
  removeItem: (id: string, variant_id: number) => {},
  updateItem: (id: string, variant_id: number, newQuantity: number) => {},
  calculateShipping: async (country: string, cartItems: CartItem[]) => "",
  getShippingInfo: async (item: CartItem, country: string) => undefined,
  getTotalPrice: () => "",
  selectedCountry: "",
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => {},
  shippingCost: "",
  totalItems: 0,
  isAdding: false,
};

const CartContext = createContext<CartContextType>(initValue);

export const CartProvider = ({ children, initialItems }: CartProviderProps) => {
  const [shippingCost, setShippingCost] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialItems.map((item) => ({ ...item, quantity: 1 }))
  );
  const [isMounted, setIsMounted] = useState(false);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const [isAdding, setIsAdding] = useState(false);

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
  }, [selectedCountry, cartItems, isMounted, shippingCost]);

  const calculateAndSetShippingCost = async () => {
    const shipping = await calculateShipping(selectedCountry, cartItems);
    setShippingCost(shipping);
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      calculateAndSetShippingCost();
    }
  }, [cartItems, selectedCountry]);

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

  //Old code that didn't work...
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

      console.log(`Index of item to update: ${itemIndex}`);

      if (itemIndex === -1) {
        // If the item doesn't exist, just return the previous state.
        return prevItems;
      }

      // Create a new item with the updated quantity
      const updatedItem = {
        ...prevItems[itemIndex],
        quantity: newQuantity,
      };

      console.log(`Updated item: ${JSON.stringify(updatedItem)}`);

      // Create a new array with the updated item
      const newItems = [
        ...prevItems.slice(0, itemIndex),
        updatedItem,
        ...prevItems.slice(itemIndex + 1),
      ];

      console.log(`New items array: ${JSON.stringify(newItems)}`);

      return newItems;
    });
  };

  const removeItem = async (product_id: string, variant_id: number) => {
    setCartItems((prevItems) => {
      // Filter out the item to be removed
      return prevItems.filter(
        (item) =>
          !(item.product_id === product_id && item.variant_id === variant_id)
      );
    });
  };

  const calculateShipping = async (country: string, cartItems: CartItem[]) => {
    const shippingCostsByProvider: { [key: string]: number } = {};
    const requests = [];

    for (let item of cartItems) {
      const shippingCostDataString = localStorage.getItem(
        `${item.print_provider_id}_${item.blueprint_id}_${country}`
      );

      let shippingCostData;

      if (shippingCostDataString) {
        console.log("using prev shipping cost");
        shippingCostData = JSON.parse(shippingCostDataString);
        requests.push({ item, shippingCostData });
      } else {
        console.log("getting new shipping cost");
        const request = getShippingInfo(item, country).then(
          (shippingCostData) => ({ item, shippingCostData })
        );
        requests.push(request);
      }
    }

    const results = await Promise.all(requests);

    results.forEach(({ item, shippingCostData }) => {
      const existingCost = shippingCostsByProvider[item.print_provider_id] || 0;

      const newCost =
        existingCost === 0
          ? shippingCostData.firstItemCost +
            shippingCostData.additionalItemCost * (item.quantity - 1)
          : existingCost + shippingCostData.additionalItemCost * item.quantity;

      shippingCostsByProvider[item.print_provider_id] = newCost;
    });

    const totalShippingCost = Object.values(shippingCostsByProvider).reduce(
      (a, b) => a + b,
      0
    );

    return totalShippingCost.toFixed(2);
  };

  const getShippingInfo = async (item: CartItem, country: string) => {
    try {
      const response = await fetch("/api/printify/get-shipping", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          blueprint_id: item.blueprint_id,
          print_provider_id: item.print_provider_id,
        }),
      });
      const data = await response.json();

      console.log(data);

      const restOfTheWorldProfile = data.profiles.find(
        (profile: ShippingProfile) =>
          profile.countries.includes("REST_OF_THE_WORLD")
      );

      // Filter profiles to those applicable for this item's variant_id and the selected country
      const applicableProfiles = data.profiles.filter(
        (profile: ShippingProfile) => {
          return (
            profile.variant_ids.includes(item.variant_id) &&
            profile.countries.includes(country)
          );
        }
      );

      // If no applicable profile found for the selected country, use the "REST_OF_THE_WORLD" profile
      let profile;
      if (applicableProfiles.length) {
        profile = applicableProfiles[0];
      } else if (restOfTheWorldProfile) {
        profile = restOfTheWorldProfile;
      } else {
        console.error(
          "No applicable shipping profile found for item",
          item.product_id,
          "and country",
          country
        );
        return; // Or handle this situation appropriately
      }

      const firstItemCost = profile.first_item.cost / 100;
      const additionalItemCost = profile.additional_items.cost / 100;

      // Save the costs as an object with a specific key for this item and country
      localStorage.setItem(
        `${item.print_provider_id}_${item.blueprint_id}_${country}`,
        JSON.stringify({ firstItemCost, additionalItemCost })
      );

      return { firstItemCost, additionalItemCost };
    } catch (error) {
      console.error("Failed to fetch shipping information:", error);
    }
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
        isAdding,
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
