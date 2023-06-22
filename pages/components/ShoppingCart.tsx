import { CartItem } from "@/types";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const {
    items,
    updateItem,
    removeItem,
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
          } bg-white right-0 w-[500px] flex items-center flex-col p-4  min-h-12  absolute top-0 overflow-scroll shadow-xl h-[100vh] display`}
        >
          <h3 className="text-2xl font-bold  pb-6 ">Cart {totalItems} Items</h3>

          <div>
            {items.length ? (
              items.map((item: CartItem) => (
                <div
                  className="border border-gray-300 p-2 rounded-lg flex items-center gap-6 my-6"
                  key={item.product_id + item.variant_id}
                >
                  <img src={item.image} className=" w-24 h-24" />
                  <div>
                    <div>{item.name}</div>
                  </div>
                  <div>${item.price}</div>
                  <select
                    className="rounded-md px-1 h-6 bg-slate-200 border border-slate-300 text-slate-500"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = Number(e.target.value);
                      console.log(newQuantity);
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
                    {[...Array(11).keys()].map((value) => (
                      <option key={value} value={value}>
                        {value}
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
              <label htmlFor="countrySelect">Delivery Country: </label>
              <select
                id="countrySelect"
                value={selectedCountry}
                onChange={handleCountryChange}
                className=" p-2 m-4 mb-8 rounded-md bg-slate-200 border border-slate-300 text-slate-500 "
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
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
                <span>Subtotal before tax: </span>
                <span>
                  ${(Number(getTotalPrice()) + Number(shippingCost)).toFixed(2)}
                </span>
              </div>

              <div className=" p-1 text-sm rounded-lg mt-2 text-gray-600">
                <span>Estimated tax to be collected: </span>
                <span>${(Number(getTotalPrice()) * 0.08).toFixed(2)}</span>
              </div>

              <div className=" p-1 text-lg pt-8 mt-6 text-gray-600 border-t broder-gray-200">
                <span> Order total: </span>
                <span>
                  $
                  {(
                    Number(getTotalPrice()) +
                    Number(shippingCost) +
                    Number(getTotalPrice()) * 0.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            {items.length > 0 ? (
              <a className=" $ btn btn-primary w-full mt-4" href="/checkout">
                Proceed to Checkout
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
