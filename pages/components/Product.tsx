import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductImagesProps, ProductProps, SelectVariantProps } from "@/types";

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <div className="product-images">
      {images
        ? images.map((image) => (
            <div key={image.src}>
              <img src={image.src} className="w-40 h-40" />
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
    const [perviousVariant, setPreviousVariant] = useState<number>();

    useEffect(() => {
      if (perviousVariant) {
        setSelectedVariant(perviousVariant);
      }
    }, [items]);

    return (
      <div>
        <select
          defaultValue={
            product.variants.find((v) => v.is_default)?.id ||
            product.variants[0]?.id
          }
          onChange={(e) => {
            setPreviousVariant(Number(e.target.value.split("-")[0]));
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
        <button
          onClick={() =>
            addItem({
              id: product.id,
              name:
                product.title +
                ", " +
                variants.find((v) => v.id === selectedVariant)?.title,
              price: 20,
            })
          }
        >
          Add to cart
        </button>
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
