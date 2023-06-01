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
  id: string;
  name: string;
  price: number;
  variant_id: number;
  blueprint_id: number;
  print_provider_id: number;
  image: string;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (id: string, variant_id: number) => void;
  updateItem: (id: string, variant_id: number, quantity: number) => void;
};

export type CartItem = {
  id: string; // This should map to the product_id for Printify
  variant_id: number; // This will be needed for Printify
  name: string;
  quantity: number;
  price: number; // This is important for Stripe
  blueprint_id: number;
  print_provider_id: number;
  image: string;
};

export type ShoppingCartProps = {
  items: Item[];
};

export type ShippingDetail = {
  cost: number;
  method: string;
  // Add any other fields here that you need for your application
};
