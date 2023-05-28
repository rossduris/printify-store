import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider, useCart } from "./context/CartContext";

export default function App({ Component, pageProps }: AppProps) {
  const { items } = useCart();
  return (
    <CartProvider initialItems={items}>
      <Component {...pageProps} />
    </CartProvider>
  );
}
