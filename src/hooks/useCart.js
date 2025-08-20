import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx == null)
    throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
