import { CartItem } from "@/types";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type PrintProviderGroupProps = {
  items: CartItem[];
};

type ProviderItemsProps = {
  itemsOfProvider: CartItem[];
  country: string;
  children: React.ReactNode;
};

const ProviderItems = ({
  itemsOfProvider,
  country,
  children,
}: ProviderItemsProps) => {
  const { updateItem, removeItem, shippingCostsByProvider } = useCart();

  const [toggleShipping, setToggleShipping] = useState(false);

  // Get the provider id from the first item
  const providerId = itemsOfProvider[0]?.print_provider_id;

  // Get the corresponding shipping cost
  const shippingCost = shippingCostsByProvider[providerId];

  const handlingTimeDataString = localStorage.getItem(
    `${providerId}_${itemsOfProvider[0]?.blueprint_id}_${country}` // Use country here
  );

  const handlingTimeData = handlingTimeDataString
    ? JSON.parse(handlingTimeDataString)
    : {};

  const handlingTime = handlingTimeData.handlingTime || {};

  return (
    <div>
      <div>
        {itemsOfProvider.map((item: CartItem) => {
          return (
            <div
              className=" p-2 rounded-lg flex items-center gap-6 my-6 justify-between"
              key={item.product_id + item.variant_id}
            >
              <Image
                alt={item.name}
                src={item.image}
                width={200}
                height={200}
              />
              <div>
                <div>{item.name}</div>
              </div>
              <div>${item.price}</div>

              <select
                className="rounded-md px-1 h-6 bg-slate-200 text-slate-500"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Number(e.target.value);
                  console.log(newQuantity);
                  if (newQuantity > 0) {
                    updateItem(item.product_id, item.variant_id, newQuantity);
                  } else {
                    removeItem(item.product_id, item.variant_id);
                  }
                }}
              >
                {[...Array(11).keys()]
                  .filter((v, i) => i != 0)
                  .map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
              </select>
              <div className="w-5 h-5">
                <TrashIcon
                  onClick={() => removeItem(item.product_id, item.variant_id)}
                  className=" cursor-pointer hover:text-gray-400 h-5 w-5 text-gray-500 transition-all duration-1"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        onClick={() => setToggleShipping(!toggleShipping)}
        className=" text-xs text-blue-300 hover:text-blue-400 select-none cursor-pointer relative flex w-full justify-end transition-all duration-1"
      >
        <div>{children} </div>
        <span className="px-4">
          {!toggleShipping ? "View Details" : "Hide Details"}
        </span>
      </div>
      <div className={`${toggleShipping ? "showShipping" : "hideShipping"} `}>
        <div className=" w-full flex justify-end text-sm pt-2 text-gray-500 pr-4">
          Shipping & Handling Cost:
          {shippingCost ? `$${shippingCost}` : "Calculating..."}
        </div>
        <div className=" w-full flex justify-end text-sm pt-2 text-gray-500 pr-4">
          Estimated Shipping & Handling Time:
          {handlingTime.value
            ? `${handlingTime.value} ${handlingTime.unit}s`
            : "10 Days"}
        </div>
      </div>
    </div>
  );
};

const PrintProviderGroup = ({ items }: PrintProviderGroupProps) => {
  const groupedItems = items.reduce(
    (grouped: { [key: string]: CartItem[] }, item: CartItem) => {
      const key = item.print_provider_id;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
      return grouped;
    },
    {}
  );

  const { selectedCountry } = useCart();

  return (
    <div>
      {items && items.length != 0
        ? Object.entries(groupedItems).map(
            ([providerId, itemsOfProvider], i) => (
              <div
                className="border border-b-gray-100 my-1 p-4 rounded-lg relative "
                key={providerId}
              >
                <h3 className=" absolute bottom-0 text-gray-400 text-xs  hover:text-gray-300"></h3>
                <ProviderItems
                  itemsOfProvider={itemsOfProvider}
                  country={selectedCountry}
                >
                  Package {i + 1}
                </ProviderItems>
              </div>
            )
          )
        : "No items"}
    </div>
  );
};

export default PrintProviderGroup;
