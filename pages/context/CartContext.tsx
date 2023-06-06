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
} from "react";

const initValue: CartContextType = {
  items: [],
  addItem: async (item: Item) => {},
  removeItem: async (id: string, variant_id: number) => {},
  updateItem: async (id: string, variant_id: number, newQuantity: number) => {},
  calculateShipping: async (country: string, cartItems: CartItem[]) => "",
  getShippingInfo: async (item: CartItem, country: string) => undefined,
  getTotalPrice: () => "",
  selectedCountry: "",
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => {},
  shippingCost: "",
  totalItems: 0,
};

const CartContext = createContext<CartContextType>(initValue);

export const CartProvider = ({ children, initialItems }: CartProviderProps) => {
  const [shippingCost, setShippingCost] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialItems.map((item) => ({ ...item, quantity: 1 }))
  );
  const [isMounted, setIsMounted] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Load initial country from localStorage or default to 'US'
  let initialCountry;
  try {
    initialCountry = localStorage.getItem("selectedCountry") || "US";
  } catch {
    initialCountry = "US";
  }

  const [updatingShipping, setUpdatingShipping] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  const quantityChecksum = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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

  useEffect(() => {
    const fetchShippingCost = async () => {
      const newShippingCost = await calculateShipping(
        selectedCountry,
        cartItems
      );
      setShippingCost(newShippingCost);
    };

    fetchShippingCost();
  }, [selectedCountry, cartItems, quantityChecksum]);

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
  const addItem = async (item: Item) => {
    setCartItems((prevItems) => {
      // Check if the item already exists in the cart.
      const existingItemIndex = prevItems.findIndex(
        (i) =>
          i.product_id === item.product_id && i.variant_id === item.variant_id
      );

      if (existingItemIndex > -1) {
        // If the item already exists, update its quantity.
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity = Math.min(
          newItems[existingItemIndex].quantity + 1,
          10
        );
        return newItems;
      } else {
        // If the item doesn't exist, add it to the cart.
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    // Calculate the new shipping cost
    const newShippingCost = await calculateShipping(selectedCountry, cartItems);
    setShippingCost(newShippingCost);

    // Store the new shipping cost in localStorage
    try {
      localStorage.setItem("shippingCost", newShippingCost.toString());
    } catch (error) {
      console.error("Failed to save shipping cost in localStorage:", error);
    }

    // Then, increment the total items count
    setTotalItems((prevItemsCount) => prevItemsCount + 1);
  };

  const updateItem = async (
    product_id: string,
    variant_id: number,
    newQuantity: number
  ) => {
    const itemToUpdate = cartItems.find(
      (item) => item.product_id === product_id && item.variant_id === variant_id
    );

    if (!itemToUpdate) {
      // If the item doesn't exist, just return the previous state.
      return;
    }
    console.log("updated quantity to ", newQuantity);

    const updatedItem: CartItem = {
      ...itemToUpdate,
      quantity: newQuantity,
    };

    const updatedCartItems = cartItems.map((item) =>
      item.product_id === product_id && item.variant_id === variant_id
        ? updatedItem
        : item
    );

    setCartItems(updatedCartItems);

    // Adjust the total items count
    setTotalItems(
      updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
    );
  };

  useEffect(() => {
    const calculateNewShippingCost = async () => {
      setUpdatingShipping(true);
      // After the cart items are updated, calculate the new shipping cost
      const newShippingCost = await calculateShipping(
        selectedCountry,
        cartItems
      );
      setShippingCost(newShippingCost);

      // Store the new shipping cost in localStorage
      try {
        localStorage.setItem("shippingCost", newShippingCost.toString());
      } catch (error) {
        console.error("Failed to save shipping cost in localStorage:", error);
      }
      setUpdatingShipping(false);
    };

    if (!updatingShipping) {
      calculateNewShippingCost();
    }
  }, []);

  const removeItem = async (product_id: string, variant_id: number) => {
    setCartItems((prevItems) => {
      // Filter out the item to be removed
      const remainingItems = prevItems.filter(
        (item) =>
          !(item.product_id === product_id && item.variant_id === variant_id)
      );

      setTotalItems(
        remainingItems.reduce((sum, item) => sum + item.quantity, 0)
      );

      return remainingItems;
    });
  };

  const calculateShipping = async (country: string, cartItems: CartItem[]) => {
    // Create a map to track shipping costs by print_provider_id
    const shippingCostsByProvider: { [key: string]: number } = {};

    for (let item of cartItems) {
      const shippingCostDataString = localStorage.getItem(
        `${item.print_provider_id}_${item.blueprint_id}_${country}`
      );

      let shippingCostData;

      if (shippingCostDataString) {
        console.log("using prev shipping cost");
        shippingCostData = JSON.parse(shippingCostDataString);
      } else {
        console.log("getting new shipping cost");
        shippingCostData = await getShippingInfo(item, country);

        if (!shippingCostData) {
          continue; // Skip this item if there's no shipping data
        }
      }

      const existingCost = shippingCostsByProvider[item.print_provider_id] || 0;

      // If it's the first item from this print provider, use firstItemCost, otherwise use additionalItemCost
      const newCost =
        existingCost === 0
          ? shippingCostData.firstItemCost
          : shippingCostData.additionalItemCost;

      shippingCostsByProvider[item.print_provider_id] = existingCost + newCost;
    }

    // Calculate the total shipping cost by summing up the costs for each provider
    const totalShippingCost = Object.values(shippingCostsByProvider).reduce(
      (a, b) => a + b,
      0
    );

    return totalShippingCost.toFixed(2); // Assuming we want to keep 2 decimal places
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
