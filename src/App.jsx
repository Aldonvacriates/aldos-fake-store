import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar";
import ProductList from "./pages/ProductList";
import AddProduct from "./components/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./components/Checkout";
import Cart from "./pages/CartPage"; // 👈 make sure this exists

// 👇 Cart context
import { CartProvider } from "./context/CartContext";

// 👇 toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <NavigationBar />
        <main className="py-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* global toasts (bottom-right) */}
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
