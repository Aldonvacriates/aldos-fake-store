/**
 * CartContext.jsx
 *
 * Purpose:
 * - Provide a centralized cart state for the app via React Context.
 * - Persist cart contents to localStorage under the key "cart:v1".
 * - Expose actions (add, remove, updateQty, clear) and derived values
 *   (cartCount, cartTotal) to consuming components/hooks.
 *
 * Notes:
 * - Keep exports as named exports so imports remain explicit:
 *     import { CartProvider, CartContext } from "./context/CartContext";
 * - localStorage operations are wrapped in try/catch to avoid breaking the app
 *   when storage is unavailable or contains malformed JSON.
 * - The reducer stores a minimal representation of products (id, title, price, image)
 *   to keep the persisted payload small while still rendering cart items.
 */

import { createContext, useEffect, useMemo, useReducer } from "react";

// Create context object. Consumers can use this to read cart state.
const CartContext = createContext(null);

/**
 * loadInitial()
 * - Reads the cart from localStorage on first render.
 * - Returns an array (empty if nothing stored or on error).
 */
function loadInitial() {
  try {
    const raw = localStorage.getItem("cart:v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    // If parsing fails or storage is unavailable, start with an empty cart.
    return [];
  }
}

/**
 * cartReducer(state, action)
 * - Handles cart mutations with a small set of action types:
 *   - ADD: add a product (or increase qty if it already exists)
 *   - REMOVE: remove an item by id
 *   - UPDATE_QTY: set a new quantity (removes item if qty <= 0)
 *   - CLEAR: empty the cart
 *
 * Notes on ADD:
 * - We store a minimal item snapshot to reduce persisted size.
 * - The reducer is pure and returns new arrays/objects for React updates.
 */
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty } = action.payload;
      const idx = state.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      const minimal = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      };
      return [...state, { ...minimal, qty }];
    }
    case "REMOVE": {
      return state.filter((i) => i.id !== action.payload.id);
    }
    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) return state.filter((i) => i.id !== id);
      return state.map((i) => (i.id === id ? { ...i, qty } : i));
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

/**
 * CartProvider
 * - Wrap your app with <CartProvider> so any component can access the cart.
 * - Exposes: items, cartCount, cartTotal, addItem, removeItem, updateQty, clearCart
 */
export function CartProvider({ children }) {
  // useReducer with lazy initializer to load from localStorage only once.
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitial);

  // Persist items to localStorage whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(items));
    } catch {
      // Ignore errors (e.g. storage quota, disabled storage)
    }
  }, [items]);

  // Action helpers - dispatch simple action objects to the reducer.
  const addItem = (product, qty = 1) =>
    dispatch({ type: "ADD", payload: { product, qty } });
  const removeItem = (id) => dispatch({ type: "REMOVE", payload: { id } });
  const updateQty = (id, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  // Derived values (memoized for performance)
  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );
  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  // Value object provided to consumers
  const value = {
    items,
    cartCount,
    cartTotal,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/*
  Exports:
  - CartContext: the context object (useful for useContext or tests)
  - CartProvider: the provider component to wrap the app
*/
export { CartContext };
export default CartContext;
