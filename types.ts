import { ChangeEvent } from "react";

export type ShopProduct = {
  blueprint_id: number;
  print_provider_id: number;
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
  product: ShopProduct;
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

export type PrintifyLineItem = {
  product_id: string;
  variant_id: number;
  quantity: number;
  print_provider_id?: number;
  blueprint_id?: string;
  sku?: string;
};

export type Address = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};

export type PrintifyOrder = {
  line_items: PrintifyLineItem[];
  address_to: Address;
};

export type Item = {
  product_id: string;
  name: string;
  price: number;
  variant_id: number;
  blueprint_id: number;
  print_provider_id: number;
  image: string;
};

export type CartItem = Item & {
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (id: string, variant_id: number) => void;
  updateItem: (id: string, variant_id: number, quantity: number) => void;
  getShippingInfo: (
    item: CartItem,
    country: string
  ) => Promise<
    { firstItemCost: number; additionalItemCost: number } | undefined
  >;
  calculateShipping: (
    country: string,
    cartItems: CartItem[]
  ) => Promise<string>;
  getTotalPrice: () => string;
  selectedCountry: string;
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  shippingCost: string;
  totalItems: number;
  isAdding: boolean;
};

export type ShoppingCartProps = {
  items: Item[];
};

export type ShippingDetails = {
  handling_time: object;
  profiles: Array<ShippingProfile>;
};

export type ShippingProfile = {
  first_item: ShippingCostDetail;
  additional_items: ShippingCostDetail;
  countries: Array<string>;
  variant_ids: Array<number>;
};

export type ShippingCostDetail = {
  cost: number;
  currency: string;
};

export type CartProviderProps = {
  children: React.ReactNode;
  initialItems: Item[];
};
