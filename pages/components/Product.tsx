import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductImagesProps, ProductProps, SelectVariantProps } from "@/types";

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <div className="product-images min-h-[400px]">
      {images
        ? images
            .filter((img, i) => i === 0)
            .map((image, i) => (
              <div key={image.src} className=" relative min-h-[300px]">
                <img
                  className=" absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[30%]"
                  src="/assets/loading.gif"
                  alt="loading..."
                />
                <img src={image.src} className="w-full h-full z-10 relative" />
              </div>
            ))
        : "Loading variant images"}
    </div>
  );
};

const SelectVariant = React.memo(
  ({
    variants,
    product,
    selectedVariant,
    setSelectedVariant,
  }: SelectVariantProps) => {
    const { addItem, items } = useCart();

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
          {variants
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
            className=" btn btn-primary"
            onClick={() =>
              addItem({
                id: product.id,
                name:
                  product.title +
                  ", " +
                  variants.find((v) => v.id === selectedVariant)?.title,
                price:
                  Number(
                    variants.find((v) => v.id === selectedVariant)?.price
                  ) / 100,
                variant_id: Number(
                  variants.find((v) => v.id === selectedVariant)?.id
                ),
                blueprint_id: Number(product.blueprint_id),
                print_provider_id: Number(product.print_provider_id),
                image: String(
                  product.images.filter((image) =>
                    image.variant_ids.includes(Number(selectedVariant))
                  )[0].src
                ),
              })
            }
          >
            Add to cart
          </label>
          <label htmlFor="my-modal" className="btn">
            Quick Look
          </label>
          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <label htmlFor="my-modal" className="modal cursor-pointer">
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
          </label>
          <label className="text-green-800 text-xl font-bold flex justify-center items-end">
            $
            {Number(variants.find((v) => v.id === selectedVariant)?.price) /
              100}
          </label>
        </div>
      </div>
    );
  }
);

const Product = React.memo(({ product }: ProductProps) => {
  const [selectedVariant, setSelectedVariant] = useState<number | undefined>(
    () => {
      const defaultVariant = product.variants.find((v) => v.is_default);
      return defaultVariant ? defaultVariant.id : product.variants[0]?.id;
    }
  );

  const variantImages = useMemo(() => {
    return selectedVariant
      ? product.images.filter((image) =>
          image.variant_ids.includes(selectedVariant)
        )
      : [];
  }, [product.images, selectedVariant]);

  return (
    <div className=" bg-white shadow-xl rounded-2xl z-30">
      <h1 className="text-gray-300 text-2xl font-bold p-4">{product.title}</h1>

      <ProductImages selectedVariant={selectedVariant} images={variantImages} />
      <SelectVariant
        variants={product.variants}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        product={product}
      />
    </div>
  );
});

export default Product;
