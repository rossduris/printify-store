import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { ProductImagesProps, ProductProps, SelectVariantProps } from "@/types";
import Modal from "./Modal";
import Image from "next/image";

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <div className="product-images min-h-[400px]">
      {images
        ? images
            .filter((img, i) => i === 0)
            .map((image, i) => (
              <div key={image.src} className=" relative min-h-[300px]">
                <Image
                  className=" absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[30%]"
                  width="100"
                  height="100"
                  src="/assets/loading.gif"
                  alt="loading..."
                />
                <Image
                  height={200}
                  width={200}
                  alt="product-image"
                  src={image.src}
                  className="w-full h-full z-10 relative"
                />
              </div>
            ))
        : "Loading variant images"}
    </div>
  );
};

ProductImages.displayName = "ProductImages";

const SelectVariant = React.memo(
  ({
    variants,
    product,
    selectedVariant,
    setSelectedVariant,
  }: SelectVariantProps) => {
    const { addItem } = useCart();

    if (
      !variants ||
      variants === undefined ||
      product === undefined ||
      !product.variants
    )
      return <div>Loading variants...</div>;

    return (
      <div className="flex items-center flex-col p-4 relative">
        <select
          className=" select select-ghost w-full"
          defaultValue={
            product.variants.find((v) => v.is_default)?.id ||
            product.variants[0]?.id
          }
          onChange={(e) => {
            // setPreviousVariant(Number(e.target.value.split("-")[0]));
            setSelectedVariant(Number(e.target.value.split("-")[0]));
          }}
        >
          {variants && variants !== undefined
            ? variants
                .filter((variant) => variant.is_enabled)
                .map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.id} - {variant.title}
                  </option>
                ))
            : "Loading variants..."}
        </select>
        <div className="flex justify-between pt-4 w-full">
          <label
            className="btn btn-primary w-[70%] ml-4"
            onClick={() => {
              const variant =
                variants && variants.find((v) => v.id === selectedVariant);
              addItem({
                product_id: product.id,
                name: `${product.title}, ${
                  variant ? variant.title : "no variants"
                }`,
                price: Number(variant ? variant.price : 0) / 100,
                variant_id: Number(variant ? variant.id : undefined),
                blueprint_id: Number(product.blueprint_id),
                print_provider_id: Number(product.print_provider_id),
                image: String(
                  product.images.find((image) =>
                    image.variant_ids.includes(Number(selectedVariant))
                  )?.src || ""
                ),
              });
            }}
          >
            Add to cart
          </label>

          {/* 
          
          Modal TODO:

          <label onClick={toggleModal} className="btn">
            Quick Look
          </label> */}

          {/* <label htmlFor="my-modal" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <ProductImages
                selectedVariant={selectedVariant}
                images={product.images}
              />
              <div className="modal-action">
                <label htmlFor="my-modal" className="btn">
                  Close
                </label>
              </div>
            </label>
          </label> */}
          <label className="text-green-800 text-xl font-bold flex justify-center items-end">
            $
            {variants && variants !== undefined
              ? Number(variants.find((v) => v.id === selectedVariant)?.price) /
                100
              : "error"}
          </label>
        </div>
      </div>
    );
  }
);

SelectVariant.displayName = "SelectVariant";

const Product = React.memo(({ product }: ProductProps) => {
  const [selectedVariant, setSelectedVariant] = useState<any>(() => {
    if (!product || !product.variants) return null;
    const defaultVariant = product.variants.find((v) => v.is_default);
    return defaultVariant ? defaultVariant.id : product.variants[0]?.id;
  });

  // useMemo is called at the top level, without being wrapped in any condition.
  const variantImages = selectedVariant
    ? product.images.filter((image) =>
        image.variant_ids.includes(selectedVariant)
      )
    : [];
  Product.displayName = "Product";

  if (selectedVariant == null) return <div>Loading...</div>;

  if (!product || !product.variants || product == undefined)
    return <div>Loading...</div>;

  return (
    <div className=" bg-white shadow-xl rounded-2xl z-30">
      <h1 className="text-gray-300 text-2xl font-bold p-4">{product.title}</h1>

      <ProductImages selectedVariant={selectedVariant} images={variantImages} />
      <SelectVariant
        variants={product.variants ? product.variants : []}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        product={product}
      />
    </div>
  );
});

export default Product;
