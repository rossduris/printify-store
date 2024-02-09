import React, { useEffect, useMemo, useState } from "react";
import ShoppingCart from "./components/ShoppingCart";
import Product from "./components/Product";
import { ShopProduct } from "@/types";
import Modal from "./components/Modal";
import Link from "next/link";

const Shop = () => {
  const [products, setProducts] = useState<Array<ShopProduct>>();

  const getProducts = async () => {
    try {
      const response = await fetch("/api/printify/get-shop-products", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        referrerPolicy: "no-referrer",
      });
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className=" bg-slate-800">
      <ShoppingCart />

      <h1 className="text-4xl font-bold px-10 pt-10">
        <Link href="/">Planet Cyborg</Link>
      </h1>
      {/* <button onClick={toggleModal}>Toggle</button> */}

      <div className="bg-[#f1f1f1] p-4 rounded-lg grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 relative gap-10 m-10">
        {products
          ? products.map((product) => {
              return <Product key={product.id} product={product} />;
            })
          : "Loading..."}
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-300 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white shadow-xl rounded-2xl">
            <Modal />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
