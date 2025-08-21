/**
 * useApi / useAsync
 *
 * Utility hooks to simplify API calls and async operations:
 * - useApi(apiFunction, deps)
 *     - Calls the provided apiFunction (should return an axios-like response or any object)
 *     - Manages data, loading and error states automatically
 *     - Returns { data, loading, error, refetch }
 *     - Useful for simple data fetching in components
 *
 * - useAsync()
 *     - Provides an `execute` function to run arbitrary async work with loading/error/data state
 *     - Useful for on-demand operations (form submit, button actions, etc.)
 *
 * Notes / best-practices:
 * - apiFunction should be a function (no args) that performs the fetch and returns a response.
 *   Example: () => axios.get("/api/items")
 * - If apiFunction returns an axios response, useApi sets `data = response.data`.
 *   If your function returns raw data, adapt accordingly (e.g. return { data }).
 * - The dependencies array controls when useApi re-runs; include inputs used by apiFunction.
 * - Both hooks surface `error` as a string (error.message fallback); components can show it in UI.
 * - Consider adding cancellation (AbortController) in apiFunction or here for long-running fetches.
 */

import { useState, useEffect } from "react";

/**
 * Custom hook for managing API calls with loading, error, and data states
 * @param {Function} apiFunction - The API function to call. Should return a promise.
 * @param {Array} dependencies - Dependencies array for useEffect (when to refetch)
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useApi(apiFunction, dependencies = []) {
  // Local state: the fetched data, loading flag and any error message.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetchData is the main worker that calls apiFunction and updates state.
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // apiFunction should return a promise; if using axios it will be a response object.
      const response = await apiFunction();

      // If response has `.data` (axios), use it; otherwise use the value directly.
      setData(
        response && response.data !== undefined ? response.data : response
      );
    } catch (err) {
      // Normalize error message so UI can display it easily.
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Run on mount and whenever dependencies change.
  useEffect(() => {
    fetchData();
    // Intentionally not including fetchData in deps to avoid re-creating effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Expose refetch so consumers can manually refresh data.
  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Custom hook for managing async operations with loading and error states
 * Useful for actions triggered by user interaction (submit, click).
 *
 * Usage:
 * const { execute, loading, error, data } = useAsync();
 * await execute(() => api.call(...));
 *
 * Returns:
 * - execute(asyncFunction): runs the async function and manages state
 * - loading: boolean while executing
 * - error: string|null on failure
 * - data: last returned value from the asyncFunction
 */
export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // execute wraps any async function and captures its result/error.
  const execute = async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);

      // asyncFunction should be a function returning a promise.
      const result = await asyncFunction();

      // Save returned data for consumer use (could be response or raw)
      setData(result);
      return result;
    } catch (err) {
      setError(err?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    data,
  };
}
