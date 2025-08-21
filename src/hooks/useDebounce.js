/**
 * useDebounce.js
 *
 * Utility hooks for debouncing values and callbacks.
 *
 * Exports:
 *  - useDebounce(value, delay)
 *      Returns a debounced copy of `value` that only updates after `delay` ms
 *      of no changes. Useful for search inputs, filtering, etc.
 *
 *  - useDebounceCallback(callback, delay, deps)
 *      Returns a debounced wrapper around `callback`. When the returned function
 *      is called repeatedly, the underlying `callback` will only run after
 *      `delay` ms have elapsed since the last call.
 *
 * Notes / best-practices:
 *  - Both hooks clean up timers on unmount to avoid memory leaks.
 *  - Provide a sensible `delay` (e.g. 200-500ms for user input).
 *  - For useDebounceCallback, prefer stable `callback` or include it in `deps`.
 *  - The hooks avoid introducing extra re-renders beyond what React requires.
 *
 * Usage examples:
 *  const debouncedQuery = useDebounce(query, 300);
 *
 *  const debouncedSearch = useDebounceCallback((q) => fetchItems(q), 300, [fetchItems]);
 *  debouncedSearch(query);
 */

import { useState, useEffect } from "react";

/**
 * Debounce a value: returns the value but only updates it after `delay` ms
 * without further changes.
 *
 * @param {any} value - Value to debounce (string, number, object, etc.)
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value or delay changes or on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback: returns a function that delays invoking `callback`
 * until after `delay` ms have elapsed since the last time the debounced
 * function was invoked.
 *
 * Important:
 *  - The `deps` array is used to reset internal timer when dependencies change.
 *  - If `callback` identity changes frequently, include it in `deps`.
 *
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependency array to control when the debounced wrapper resets
 * @returns {Function} - Debounced function
 */
export function useDebounceCallback(callback, delay, deps = []) {
  // Store timer id in state so we can clear it from within effects and closures.
  const [debounceTimer, setDebounceTimer] = useState(null);

  // The debounced function: clears any existing timer and schedules a new one.
  const debouncedCallback = (...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      // Call the provided callback with latest args after the delay.
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  };

  // Clear timer on unmount to avoid running callback after component is gone.
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // When dependencies change, clear any existing timer and reset state.
  // This ensures the debounce window is reset if external inputs change.
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return debouncedCallback;
}
