import { createContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function loadInitial() {
  try {
    const raw = localStorage.getItem("cart:v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

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

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitial);

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) =>
    dispatch({ type: "ADD", payload: { product, qty } });
  const removeItem = (id) => dispatch({ type: "REMOVE", payload: { id } });
  const updateQty = (id, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );
  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

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

export { CartContext };
export default CartContext;
