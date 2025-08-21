// main.jsx
// Entry point for the React application.
// Mounts the App component to the DOM and sets up global styles and strict mode.

import { StrictMode } from "react"; // Enables additional checks and warnings in development
import { createRoot } from "react-dom/client"; // Modern React 18+ root API
import "./index.css"; // Global CSS styles for the app
import App from "./App.jsx"; // Main App component
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS for styling

// Mount the React app to the #root element in the HTML
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* StrictMode helps catch potential problems in development */}
    <App />
  </StrictMode>
);
