import { CartItem, HandlingTime, ShippingProfile } from "@/types";

export const useShippingCost = () => {
  const calculateShipping = async (country: string, cartItems: CartItem[]) => {
    const shippingCostsByProvider: { [key: string]: number } = {};
    const handlingTimesByProvider: { [key: string]: HandlingTime } = {};
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
      handlingTimesByProvider[item.print_provider_id] =
        shippingCostData.handlingTime;
    });

    const totalShippingCost = Object.values(shippingCostsByProvider).reduce(
      (a, b) => a + b,
      0
    );

    return {
      totalShippingCost: totalShippingCost.toFixed(2),
      handlingTimesByProvider,
    };
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

      console.log("handling time: ", data);

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

      const handlingTime = data.handling_time;

      // Save the costs as an object with a specific key for this item and country
      localStorage.setItem(
        `${item.print_provider_id}_${item.blueprint_id}_${country}`,
        JSON.stringify({ firstItemCost, additionalItemCost, handlingTime })
      );

      return { firstItemCost, additionalItemCost, handlingTime };
    } catch (error) {
      console.error("Failed to fetch shipping information:", error);
    }
  };

  return { getShippingInfo, calculateShipping };
};

export default useShippingCost;
