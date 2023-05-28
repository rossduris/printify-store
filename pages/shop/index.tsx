import React, { useEffect, useState } from "react";

type ShopProduct = {
  blueprint_id: string;
  created_at: string;
  description: string;
  id: string;
  images: Array<ProductImage>;
  is_locked: boolean;
  options: Array<object>;
  print_areas: Array<object>;
  print_details: Array<object>;
  sales_channel_properties: number;
  shop_id: number;
  tags: Array<string>;
  title: string;
  twodaydelivery_enabled: boolean;
  updated_at: string;
  user_id: number;
  variants: Array<ProductVariant>;
  visible: boolean;
};

type ProductVariant = {
  cost: number;
  grams: number;
  id: number;
  is_available: boolean;
  is_default: boolean;
  is_enabled: boolean;
  options: Array<number>;
  price: number;
  quantity: number;
  sku: string;
  title: string;
};

type ProductProps = {
  variants: Array<ProductVariant>;
  images: Array<ProductImage>;

  // children: React.ReactNode;
};

type ProductImagesProps = {
  images: Array<ProductImage>;
  selectedVariant: number | undefined;
};

type ProductImage = {
  is_default: boolean;
  is_selected_for_publishing: boolean;
  position: string;
  src: string;
  variant_ids: Array<number>;
};

const Shop = () => {
  const [products, setProducts] = useState<Array<ShopProduct>>();

  const uploadFromUrl = async () => {
    // setIsLoading(true);
    const response = await fetch("/api/printify/get-shop-products", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      referrerPolicy: "no-referrer",
    });
    const data = await response.json();
    // console.log(data);
    setProducts(data.data);
    // setIsLoading(false);
  };

  useEffect(() => {
    uploadFromUrl();
  }, []);

  const ProductImages = ({ images, selectedVariant }: ProductImagesProps) => {
    return (
      <div className="product-images">
        {images && selectedVariant
          ? images
              .filter((image) => image.variant_ids.includes(selectedVariant))
              .map((image) => {
                console.log(image);
                return (
                  <div>
                    {image ? (
                      <img
                        key={image.src}
                        src={image.src}
                        className="w-40 h-40"
                      ></img>
                    ) : (
                      "Loading..."
                    )}
                  </div>
                );
              })
          : "Loading variant images"}
      </div>
    );
  };

  const Product = ({ variants, images }: ProductProps) => {
    const [selectedVariant, setSelectedVariant] = useState<number>();

    useEffect(() => {
      if (variants && variants[0]) {
        setSelectedVariant(variants[0].id);
      }
    }, []);

    return (
      <div>
        <h2>Selected Variant: {selectedVariant}</h2>
        <ProductImages images={images} selectedVariant={selectedVariant} />
        <select
          onChange={(e) =>
            setSelectedVariant(Number(e.target.value.split("-")[0]))
          }
        >
          {variants
            ? variants
                .filter((variant) => variant.is_enabled)
                .map((variant) => {
                  return (
                    <option key={variant.id}>
                      {variant.id} - {variant.title}
                    </option>
                  );
                })
            : "Loading variants..."}
        </select>
      </div>
    );
  };

  return (
    <div>
      <h1>Shop</h1>
      <div className="bg-white m-10 p-4 rounded-lg grid grid-cols-4">
        {products
          ? products.map((product) => {
              return (
                <Product
                  key={product.id}
                  variants={product.variants}
                  images={product.images}
                />
              );
            })
          : "Loading..."}
      </div>
    </div>
  );
};

export default Shop;
