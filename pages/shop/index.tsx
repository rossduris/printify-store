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
    <div>
      <h1>Shop</h1>
      <div className="shop-nav bg-slate-800 flex justify-end">
        <ShoppingCart items={items} />
      </div>
      <div className="bg-white m-10 p-4 rounded-lg grid grid-cols-4">
        {products
          ? products.map((product) => {
              return (
                <div>
                  <Product
                    key={product.id}
                    variants={product.variants}
                    images={product.images}
                    product={product}
                  />
                </div>
              );
            })
          : "Loading..."}
      </div>
    </div>
  );
};

export default Shop;
