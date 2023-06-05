import { CartContextType, CartItem, Item, ShippingProfile } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ChangeEvent,
} from "react";

const initValue: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItem: (
    id: string,
    variant_id: number,
    quantity: number,
    shippingCost?: number
  ) => {},
  calculateShipping: (country: string) => {},
  getShippingInfo: (item: CartItem, country: string) => {},
  getTotalPrice: () => {},
  selectedCountry: "",
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => {},
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

  // Load initial country from localStorage or default to 'US'
  let initialCountry;
  try {
    initialCountry = localStorage.getItem("selectedCountry") || "US";
  } catch {
    initialCountry = "US";
  }

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

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

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    calculateShipping(newCountry);

    try {
      localStorage.setItem("selectedCountry", newCountry);
    } catch {
      // Ignore any localStorage errors
    }
  };

  const addItem = async (item: Item) => {
    const cartItem = { ...item, quantity: 1 }; // Set default quantity to 1
    const shippingCostData = await getShippingInfo(cartItem, selectedCountry); // Use selectedCountry instead of "US"

    if (!shippingCostData) {
      // Handle error, shipping cost data could not be fetched.
      console.error("Failed to fetch shipping cost data");
      return;
    }
    const { firstItemCost, additionalItemCost } = shippingCostData;

    setCartItems((prevItems) => {
      // Check if this exact item already exists in the cart
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.variant_id === item.variant_id
      );

      // Check if there are other items from the same provider
      const otherItemsFromProvider = prevItems.filter(
        (i) =>
          i.print_provider_id === item.print_provider_id &&
          (i.id !== item.id || i.variant_id !== item.variant_id)
      );

      if (existingItem) {
        // Increment quantity of existing item and recalculate shipping.
        const updatedShippingCost =
          firstItemCost + additionalItemCost * existingItem.quantity;
        return prevItems.map((i) =>
          i.id === item.id && i.variant_id === item.variant_id
            ? {
                ...i,
                quantity: i.quantity + 1,
                shippingCost: updatedShippingCost,
              }
            : i
        );
      } else {
        // Add new item with quantity 1 and set its price and variant_id.
        const newShippingCost = otherItemsFromProvider.length
          ? additionalItemCost
          : firstItemCost;
        return [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            shippingCost: newShippingCost,
          } as CartItem,
        ];
      }
    });
  };

  const updateItem = async (
    id: string,
    variant_id: number,
    newQuantity: number
  ) => {
    const itemToUpdate = cartItems.find(
      (item) => item.id === id && item.variant_id === variant_id
    );

    if (!itemToUpdate) {
      // If the item doesn't exist, just return the previous state.
      return;
    }

    const shippingCostData = await getShippingInfo(
      itemToUpdate,
      selectedCountry
    );

    if (!shippingCostData) {
      // Handle error, shipping cost data could not be fetched.
      console.error("Failed to fetch shipping cost data");
      return;
    }

    const { firstItemCost, additionalItemCost } = shippingCostData;

    // Check if there is another item from the same print_provider in the cart
    const otherItemFromProvider = cartItems.find(
      (item) =>
        item.print_provider_id === itemToUpdate.print_provider_id &&
        item.id !== id &&
        item.variant_id !== variant_id
    );

    let updatedShippingCost;
    if (newQuantity === 1 && !otherItemFromProvider) {
      // If quantity is 1 and there is no other item from the same print_provider, use firstItemCost
      updatedShippingCost = firstItemCost;
    } else {
      // If quantity is more than 1, or there is another item from the same print_provider, calculate shipping cost accordingly
      updatedShippingCost =
        firstItemCost + additionalItemCost * (newQuantity - 1);
    }

    const updatedItem: CartItem = {
      ...itemToUpdate,
      quantity: newQuantity,
      shippingCost: updatedShippingCost,
    };

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.variant_id === variant_id ? updatedItem : item
      )
    );
  };

  const removeItem = async (id: string, variant_id: number) => {
    setCartItems((prevItems) => {
      // Filter out the item to be removed
      const remainingItems = prevItems.filter(
        (item) => !(item.id === id && item.variant_id === variant_id)
      );

      // Update the shipping cost of each remaining item
      remainingItems.forEach(async (item) => {
        await updateItem(item.id, item.variant_id, item.quantity);
      });

      return remainingItems;
    });
  };

  const calculateShipping = async (country: string) => {
    const updatedItems: CartItem[] = [];

    // First, sort the items by print_provider_id
    const sortedItems = [...cartItems].sort(
      (a, b) => a.print_provider_id - b.print_provider_id
    );

    let previousProviderId = -1;

    for (const item of sortedItems) {
      const shippingCostData = await getShippingInfo(item, country);

      if (!shippingCostData) {
        // Handle error, shipping cost data could not be fetched.
        console.error("Failed to fetch shipping cost data");
        continue;
      }

      const { firstItemCost, additionalItemCost } = shippingCostData;

      let updatedShippingCost;
      if (item.print_provider_id !== previousProviderId) {
        // This item is the first one from this provider
        updatedShippingCost = firstItemCost;
        previousProviderId = item.print_provider_id;
      } else {
        // This item is not the first one from this provider
        updatedShippingCost = additionalItemCost;
      }

      updatedShippingCost += additionalItemCost * (item.quantity - 1);

      const updatedItem: CartItem = {
        ...item,
        shippingCost: updatedShippingCost,
      };

      updatedItems.push(updatedItem);
    }

    setCartItems(updatedItems);
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
          item.id,
          "and country",
          country
        );
        return; // Or handle this situation appropriately
      }

      const firstItemCost = profile.first_item.cost / 100; // assuming cost is in cents
      const additionalItemCost = profile.additional_items.cost / 100;

      return { firstItemCost, additionalItemCost };
    } catch (error) {
      console.error("Failed to fetch shipping information:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const shippingCost = item.shippingCost ? item.shippingCost : 0;
        const itemPrice = item.price + shippingCost;
        return total + itemPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        selectedCountry,
        handleCountryChange,
        items: cartItems,
        addItem,
        removeItem,
        updateItem,
        calculateShipping,
        getShippingInfo,
        getTotalPrice,
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
