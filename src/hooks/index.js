/**
 * hooks/index.js
 *
 * Centralized exports for custom hooks.
 * - Keep all hook exports here so other modules can import from "../hooks"
 *   instead of referencing individual files.
 * - Use named exports to make imports explicit and avoid default-import ambiguity.
 *
 * Usage examples:
 *   import { useCart } from "../hooks";
 *   import { useLocalStorage, useDebounce } from "../hooks";
 *
 * Notes:
 * - Ensure filenames and export names are exact (case-sensitive) to avoid Vite/ESM import errors.
 * - If you add new hooks, export them here to keep imports consistent across the app.
 */
export { useCart } from "./useCart"; // cart context helper (add/update/remove/clear)
export { useLocalStorage } from "./useLocalStorage"; // simple persistent state tied to localStorage
export { useApi, useAsync } from "./useApi"; // reusable API / async helpers (loading, error, refetch)
export { useDebounce, useDebounceCallback } from "./useDebounce"; // debounce utilities for inputs/callbacks
