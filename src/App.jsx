import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import NavigationBar from "./NavigationBar.jsx";
import Home from "./Home.jsx";
import ProductList from "./ProductList.jsx";
import ProductDetails from "./ProductDetails.jsx";
import AddProduct from "./AddProduct.jsx";
import EditProduct from "./EditProduct.jsx";


function App() {
  return (
    <Router>
      <NavigationBar />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/addproduct" element={<AddProduct />} />
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
