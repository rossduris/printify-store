import React, { useEffect, useMemo, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import Product from "../components/Product";
import { ShopProduct } from "@/types";

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

  return (
    <div className=" bg-slate-800">
      <ShoppingCart />

      <h1 className="text-4xl font-bold px-10 pt-10">Planet Cyborg</h1>

      <div className="bg-[#f1f1f1] p-4 rounded-lg grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 relative gap-10 m-10">
        {products
          ? products.map((product) => {
              return <Product key={product.id} product={product} />;
            })
          : "Loading..."}
      </div>
    </div>
  );
};

export default Shop;
