/**
 * Loader.jsx
 *
 * Small reusable loading indicator component.
 *
 * Purpose:
 * - Show a centered spinner with an optional label during async operations.
 * - Keep UI consistent across the app by using a single Loader component.
 *
 * Props:
 * - label (string) - optional text displayed next to the spinner (defaults to "Loading...")
 *
 * Accessibility:
 * - Spinner is decorative; the label provides text for screen readers.
 * - If used for important loading states, consider adding aria-live on the container
 *   or providing additional visible status messages for assistive tech.
 *
 * Usage:
 *   <Loader />                    // shows "Loading..."
 *   <Loader label="Saving..." />  // shows custom label
 */
import React from "react";
import Spinner from "react-bootstrap/Spinner";

export default function Loader({ label = "Loading..." }) {
  // `label` is rendered next to the spinner to give context to the user.
  // Container uses Bootstrap utilities to center the loader horizontally and vertically.
  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      role="status" // indicates a status region for assistive tech
      aria-live="polite"
    >
      {/* Visual spinner from react-bootstrap */}
      <Spinner animation="border" aria-hidden="true" />

      {/* Text label for context; ms-2 provides spacing from the spinner */}
      <span className="ms-2">{label}</span>
    </div>
  );
}
