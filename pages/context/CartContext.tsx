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
    console.log(item);
    const cartItem = { ...item, quantity: 1 }; // Set default quantity to 1
    const shippingCost = await getShippingInfo(cartItem, selectedCountry); // Use selectedCountry instead of "US"

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.variant_id === item.variant_id
      );
      if (existingItem && shippingCost) {
        // Increment quantity of existing item and recalculate shipping.
        return prevItems.map((i) =>
          i.id === item.id && i.variant_id === item.variant_id
            ? {
                ...i,
                quantity: i.quantity + 1,
                shippingCost: shippingCost * (i.quantity + 1),
              }
            : i
        );
      } else {
        // Add new item with quantity 1 and set its price and variant_id.
        return [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            shippingCost,
          } as CartItem,
        ];
      }
    });
  };

  const updateItem = async (
    id: string,
    variant_id: number,
    newQuantity: number,
    shippingCost?: number
  ) => {
    const itemToUpdate = cartItems.find(
      (item) => item.id === id && item.variant_id === variant_id
    );
    if (!itemToUpdate) {
      // If the item doesn't exist, just return the previous state.
      return;
    }

    const updatedShippingCost = await getShippingInfo(
      itemToUpdate,
      selectedCountry
    );

    const updatedItem: CartItem = {
      ...itemToUpdate,
      quantity: newQuantity,
      shippingCost: updatedShippingCost
        ? updatedShippingCost * newQuantity
        : itemToUpdate.shippingCost,
    };

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.variant_id === variant_id ? updatedItem : item
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

  const calculateShipping = async (country: string) => {
    const updatedItems: CartItem[] = [];

    for (const item of cartItems) {
      const shippingCost = await getShippingInfo(item, country);
      const updatedItem: CartItem = {
        ...item,
        shippingCost: shippingCost ? shippingCost : item.shippingCost,
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

      const shippingCost = profile.first_item.cost / 100; // assuming cost is in cents
      const additionalItemCost = profile.additional_items.cost / 100;

      // Calculate total shipping cost based on quantity
      // The cost for the first item plus the additional cost for any additional items
      const totalShippingCost =
        shippingCost + additionalItemCost * (item.quantity - 1);

      return totalShippingCost;
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
