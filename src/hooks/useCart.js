/**
 * useCart.js
 *
 * Small wrapper hook for accessing the CartContext.
 *
 * Purpose:
 * - Provide a simple, self-documenting way for components to access cart state/actions.
 * - Fail fast with a clear error when used outside of CartProvider.
 *
 * Usage:
 *   import { useCart } from "../hooks"; // if re-exported from hooks/index.js
 *   const { items, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal } = useCart();
 *
 * Notes / gotchas:
 * - Ensure the import path and export style of CartContext match your context file.
 *   If CartContext is a named export, change the import to:
 *     import { CartContext } from "../context/CartContext";
 *   Current import assumes CartContext is the default export from ../context/CartContext.jsx.
 * - This hook intentionally does not contain business logic — it only returns the context.
 * - The thrown error helps catch missing provider wrappers during development.
 */

import { useContext } from "react";
import CartContext from "../context/CartContext.jsx"; // ensure this matches your context exports

/**
 * Custom hook to access cart context
 * Must be used within CartProvider
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    // Clear runtime guidance when the provider is missing
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
