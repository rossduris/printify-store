import { CartItem } from "@/types";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const {
    items,
    updateItem,
    removeItem,
    getTotalPrice,
    getShippingInfo,
    calculateShipping,
    selectedCountry,
    handleCountryChange,
    totalItems,
  } = useCart();
  const [cartVisible, setCartVisible] = useState(false);

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  useEffect(() => {
    const fetchShippingCost = async () => {
      const cost = await calculateShipping(selectedCountry, items);
      setShippingCost(cost);
    };

    fetchShippingCost();
  }, [selectedCountry, items, calculateShipping, totalItems]);

  const [shippingCost, setShippingCost] = useState("0.00");

  const groupedItems = items.reduce((acc, item) => {
    const key = `${item.product_id}_${item.variant_id}`;
    if (!acc[key]) {
      acc[key] = { ...item };
    }
    return acc;
  }, {} as Record<string, CartItem>);

  return (
    <>
      <div
        onClick={toggleCart}
        className={` w-full h-screen bg-black opacity-50 z-50 fixed top-0 left-0 transition-all duration-[.25] cursor-pointer ${
          !cartVisible ? "overlayShow" : "overlayHide"
        }`}
      ></div>
      <div
        className={`z-50 text-center pt-2 fixed right-0   min-h-screen h-full transition-all duration-1`}
      >
        <div
          onClick={toggleCart}
          className="absolute bg-white top-6 right-10 z-50 cursor-pointer border border-gray-400 h-10 w-14 flex justify-center items-center select-none rounded-full"
        >
          {!cartVisible ? `Cart: ${totalItems}` : "X"}
        </div>

        <div
          className={`${
            !cartVisible ? "cartShow" : "cartHide"
          } bg-white right-0 w-[400px] p-4  min-h-12  absolute top-0 overflow-scroll shadow-xl h-[100vh]`}
        >
          <h3 className="text-2xl font-bold w-full p-6">
            Cart: {totalItems} Items
          </h3>

          <div>
            {Object.values(groupedItems).length ? (
              Object.values(groupedItems).map((item: CartItem) => (
                <div
                  className="border border-gray-300 p-2 rounded-lg flex items-center gap-6"
                  key={item.product_id + item.variant_id + item.quantity}
                >
                  <div>
                    <img src={item.image} className=" w-24 h-24" />
                    <div>{item.name}</div>
                    <div>{item.product_id}</div>
                    <div>${item.price}</div>
                    <div>{item.variant_id}</div>
                    <div>{item.blueprint_id}</div>
                  </div>
                  <select
                    className="rounded-md px-1 h-6 bg-slate-200 border border-slate-300 text-slate-500"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = Number(e.target.value);
                      if (newQuantity > 0) {
                        updateItem(
                          item.product_id,
                          item.variant_id,
                          newQuantity
                        );
                      } else {
                        removeItem(item.product_id, item.variant_id);
                      }
                    }}
                  >
                    {[...Array(10).keys()].map((value) => (
                      <option key={value + 1} value={value + 1}>
                        {value + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeItem(item.product_id, item.variant_id)}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <div>No items</div>
            )}
            <div className=" pt-6">
              <label htmlFor="countrySelect">Shipping Country: </label>
              <select
                id="countrySelect"
                value={selectedCountry}
                onChange={handleCountryChange}
                className=" select bg-slate-200 border border-slate-300 text-slate-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="REST_OF_THE_WORLD">Rest of the World</option>
              </select>
            </div>

            <div className=" p-4 text-xl rounded-lg mt-2 text-gray-600">
              Shipping: ${shippingCost}
            </div>

            <div className=" p-4 text-xl rounded-lg mt-6 text-gray-600">
              Total Price: ${Number(getTotalPrice()) + Number(shippingCost)}
            </div>

            {items.length > 0 ? (
              <a className=" $ btn btn-primary w-full mt-4" href="/checkout">
                Checkout
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
