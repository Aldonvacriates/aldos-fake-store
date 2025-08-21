// App.jsx
// Main entry point for the FakeStore React application.
// Handles routing, context providers, and global UI components.

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages (main views)
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/CartPage";

// Components (reusable UI parts)
import NavigationBar from "./components/NavigationBar";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Checkout from "./components/Checkout";

// Context provider for cart state (wraps the app to provide cart data everywhere)
import { CartProvider } from "./context/CartContext";

// Toast notifications for user feedback
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    // Provide cart context to the entire app
    <CartProvider>
      {/* Set up React Router for navigation */}
      <Router>
        {/* Global navigation bar at the top */}
        <NavigationBar />
        {/* Main content area with page routing */}
        <main className="py-3">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />
            {/* Product listing page */}
            <Route path="/products" element={<ProductList />} />
            {/* Product details page (dynamic id) */}
            <Route path="/products/:id" element={<ProductDetails />} />
            {/* Edit product page (dynamic id) */}
            <Route path="/edit-product/:id" element={<EditProduct />} />
            {/* Add new product page */}
            <Route path="/addproduct" element={<AddProduct />} />
            {/* Shopping cart page */}
            <Route path="/cart" element={<Cart />} />
            {/* Checkout page */}
            <Route path="/checkout" element={<Checkout />} />
            {/* Fallback: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Toast notifications for user feedback (bottom right) */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="light"
        />
      </Router>
    </CartProvider>
  );
}

export default App;
