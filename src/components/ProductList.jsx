import { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

function ProductList() {
  const [loading, setLoading] = useState(true);
  
  
  return (
    <div className="product-list">
      <h1>Product List</h1>
      {/* Product list content goes here */}
    </div>
  );
}
export default ProductList;
