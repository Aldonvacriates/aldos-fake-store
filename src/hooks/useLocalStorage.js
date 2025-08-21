/**
 * useLocalStorage.js
 *
 * Lightweight React hook that mirrors useState but persists the value to localStorage.
 *
 * Purpose:
 * - Provide a simple API: const [value, setValue] = useLocalStorage(key, initialValue)
 * - Read initial value from localStorage (if present) or fall back to initialValue.
 * - Persist updates to localStorage and keep React state in sync.
 *
 * Notes:
 * - Value is JSON.stringified when written and JSON.parsed when read.
 * - The setter supports functional updates to match useState API.
 * - Errors reading/writing localStorage are caught and logged to avoid breaking the app.
 * - Useful for small pieces of persistent UI state (theme, last-visited page, etc.).
 */

import { useState } from "react";

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no value exists in localStorage
 * @returns {[any, function]} - [value, setValue] tuple
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state lazily: read from localStorage once on first render.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Try to read the value from localStorage
      const item = window.localStorage.getItem(key);
      // If present, parse and return it; otherwise return the provided initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If parsing fails or access to localStorage is denied, log a warning
      // and fall back to the initial value to keep the app functional.
      console.warn(
        `useLocalStorage: Error reading localStorage key "${key}":`,
        error
      );
      return initialValue;
    }
  });

  /**
   * setValue
   * - Mirrors the useState setter API.
   * - Accepts either a value or an updater function.
   * - Persists the resolved value to localStorage.
   */
  const setValue = (value) => {
    try {
      // Support functional updates: value can be a function (prev => next)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Update React state
      setStoredValue(valueToStore);
      // Persist to localStorage (stringify to preserve types/objects)
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Log errors (quota exceeded, serialization issues, etc.) but don't throw
      // to avoid breaking UI code that uses the hook.
      console.warn(
        `useLocalStorage: Error setting localStorage key "${key}":`,
        error
      );
    }
  };

  // Return the current stored value and the setter – same shape as useState.
  return [storedValue, setValue];
}
