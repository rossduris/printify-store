export type ShopProduct = {
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

export type ProductVariant = {
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

export type ProductProps = {
  variants: Array<ProductVariant>;
  images: Array<ProductImage>;
  product: ShopProduct;
  // children: React.ReactNode;
};

export type ProductImagesProps = {
  images: Array<ProductImage>;
  selectedVariant: number | undefined;
};

export type ProductImage = {
  is_default: boolean;
  is_selected_for_publishing: boolean;
  position: string;
  src: string;
  variant_ids: Array<number>;
};

export type SelectVariantProps = {
  variants: Array<ProductVariant>;
  setSelectedVariant: (id: number | undefined) => void;
  product: ShopProduct;
  selectedVariant: number | undefined;
};

export type Item = {
  id: string;
  name: string;
};

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
};

export type ShoppingCartProps = {
  items: Item[];
};
