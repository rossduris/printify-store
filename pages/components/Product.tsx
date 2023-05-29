import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductImagesProps, ProductProps, SelectVariantProps } from "@/types";

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <div className="product-images min-h-[400px] z-100">
      {images
        ? images
            .filter((img, i) => i === 0)
            .map((image, i) => (
              <div key={image.src} className=" relative min-h-[300px]">
                <img
                  className=" absolute -z-[10] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[30%]"
                  src="/assets/loading.gif"
                  alt="loading..."
                />
                <img src={image.src} className="w-full h-full z-[10]" />
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
      <div>
        <select
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
        <div>
          <label
            className=" btn btn-primary"
            onClick={() =>
              addItem({
                id:
                  product.id +
                  variants.find((v) => v.id === selectedVariant)?.id,
                name:
                  product.title +
                  ", " +
                  variants.find((v) => v.id === selectedVariant)?.title,
                price: 20,
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
              <h3 className="text-lg font-bold">
                Congratulations random Internet user!
              </h3>
              <p className="py-4">
                You've been selected for a chance to get one year of
                subscription to use Wikipedia for free!
              </p>
              <div className="modal-action">
                <label htmlFor="my-modal" className="btn">
                  Yay!
                </label>
              </div>
            </label>
          </label>
        </div>
      </div>
    );
  }
);

const Product = React.memo(({ variants, images, product }: ProductProps) => {
  const [selectedVariant, setSelectedVariant] = useState<number | undefined>(
    () => {
      const defaultVariant = variants.find((v) => v.is_default);
      return defaultVariant ? defaultVariant.id : variants[0]?.id;
    }
  );

  const variantImages = useMemo(() => {
    return selectedVariant
      ? images.filter((image) => image.variant_ids.includes(selectedVariant))
      : [];
  }, [images, selectedVariant]);

  return (
    <div>
      <h1>{product.title}</h1>
      <h2>id: {product.id}</h2>

      <h3>Selected Variant: {selectedVariant}</h3>
      <ProductImages selectedVariant={selectedVariant} images={variantImages} />
      <SelectVariant
        variants={variants}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        product={product}
      />
    </div>
  );
});

export default Product;
