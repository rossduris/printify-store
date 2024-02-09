import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import PrintProviderGroup from "./PrintProviderGroup";
import Link from "next/link";

const ShoppingCart = () => {
  const {
    items,
    getTotalPrice,
    selectedCountry,
    handleCountryChange,
    totalItems,
    shippingCost,
  } = useCart();
  const [cartVisible, setCartVisible] = useState(false);

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

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
          className="absolute bg-white top-2 right-10 z-50 cursor-pointer border border-gray-400 h-10 w-20 flex justify-center items-center select-none rounded-full"
        >
          {!cartVisible ? `Cart: ${totalItems}` : "X"}
        </div>

        <div
          className={`${
            !cartVisible ? "cartShow" : "cartHide"
          } bg-white right-0 w-[650px] flex items-center flex-col p-4  min-h-12  absolute top-0 overflow-scroll shadow-xl h-[100vh] display`}
        >
          <h3 className="text-2xl font-bold  pb-6 ">Cart {totalItems} Items</h3>

          <div className="w-full p-2">
            <PrintProviderGroup items={items} />

            <div className=" pt-6">
              <label htmlFor="countrySelect">Delivery Country: </label>
              <select
                id="countrySelect"
                value={selectedCountry}
                onChange={handleCountryChange}
                className=" p-2 m-4 mb-8 rounded-md bg-slate-200 border border-slate-300 text-slate-500 "
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="AU">Austrailia</option>
                <option value="REST_OF_THE_WORLD">Rest of the World</option>
              </select>
            </div>
            <div className="cartSummary">
              <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600">
                <span>Items:</span>
                <span>${Number(getTotalPrice()).toFixed(2)}</span>
              </div>
              <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600 border-b border-gray-200">
                <span>Shipping & Handling:</span>
                <span> ${shippingCost}</span>
              </div>

              <div className=" p-1 text-sm mt-2 text-gray-600 ">
                <span>Subtotal: </span>
                <span>
                  ${(Number(getTotalPrice()) + Number(shippingCost)).toFixed(2)}
                </span>
              </div>
            </div>
            {items.length > 0 ? (
              <Link href="/checkout">
                {" "}
                <button className=" $ btn btn-primary w-full mt-4">
                  Proceed to Checkout
                </button>
              </Link>
            ) : (
              "error"
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
