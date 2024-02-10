import React, { useState } from "react"; // Removed unused imports
import ShoppingCart from "../components/ShoppingCart";
import Product from "../components/Product";
import Modal from "../components/Modal";
import Link from "next/link";
import { ShopProduct } from "@/types"; // Ensure this path is correct
import { GetServerSidePropsContext } from "next";

// Corrected the type annotation for the products prop
const Shop = ({ products }: { products: ShopProduct[] }) => {
  return (
    <div className="bg-slate-800">
      <ShoppingCart />

      <Link href="/">
        <h1 className="text-4xl font-bold p-10">Planet Cyborg</h1>
      </Link>

      <div className="bg-[#f1f1f1] p-4 rounded-lg grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 relative gap-10 m-10">
        {
          products.length > 0
            ? products.map((product) => (
                <Product key={product.id} product={product} />
              ))
            : "Loading..." // This should ideally never show since products are fetched server-side
        }
      </div>
    </div>
  );
};

export default Shop;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Replace "YOUR_API_ENDPOINT" with your actual API endpoint
  const response = await fetch(
    "http://printify-store.vercel.app/api/printify/get-shop-products",
    {
      method: "POST", // Ensure this is the correct method and endpoint for your use case
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }
  );
  const data = await response.json();

  // Pass the products to the page via props
  return { props: { products: data.data || [] } }; // Provide a default empty array in case of fetch failure
}
