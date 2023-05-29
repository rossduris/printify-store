import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import ShoppingCart from "../components/ShoppingCart";
import Product from "../components/Product";
import { ShopProduct } from "@/types";

const Shop = () => {
  const [products, setProducts] = useState<Array<ShopProduct>>();
  const { items, addItem, removeItem } = useCart();

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
      <h1 className="text-4xl font-bold px-10 pt-10">Planet Cyborg</h1>
      <div className="shop-nav flex justify-end">
        <ShoppingCart />
      </div>
      <div className="bg-[#f1f1f1] p-4 rounded-lg grid grid-cols-3 relative z-0 gap-10 m-10">
        {products
          ? products.map((product) => {
              return (
                <Product
                  key={product.id}
                  variants={product.variants}
                  images={product.images}
                  product={product}
                />
              );
            })
          : "Loading..."}
      </div>
    </div>
  );
};

export default Shop;
