// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";

// If you have a CartContext, import it. Adjust the path to your project structure.
import { useCart } from "@/context/CartContext"; // or "../context/CartContext"

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart?.() || { addToCart: () => {} };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (mounted) {
          setProduct(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setErr("Error fetching product details.");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    // shape this to your cart item format
    addToCart?.({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1,
    });
    setActionMsg("Added to cart!");
  };

  const handleDelete = async () => {
    try {
      // FakeStore API will respond but won't persist — good enough for UI flow.
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      navigate("/products", { state: { message: "Product deleted (mock)" } });
    } catch {
      setErr("Could not delete the product.");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (err) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{err}</Alert>
        <Button as={Link} to="/products" variant="secondary">
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container className="py-4">
      {actionMsg && (
        <Alert
          variant="success"
          onClose={() => setActionMsg("")}
          dismissible
          className="mb-4"
        >
          {actionMsg}
        </Alert>
      )}

      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="g-4 align-items-start">
                <Col md={5} className="text-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="img-fluid rounded border"
                    style={{ maxHeight: 360, objectFit: "contain" }}
                  />
                </Col>

                <Col md={7}>
                  <h3 className="mb-2">{product.title}</h3>
                  <h4 className="text-primary mb-3">${product.price}</h4>

                  <div className="mb-2">
                    <Badge bg="secondary" className="text-capitalize">
                      {product.category}
                    </Badge>
                  </div>

                  <p
                    className="text-muted mb-3"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {product.description}
                  </p>

                  {product.rating && (
                    <small className="text-muted">
                      Rating: {product.rating.rate} ({product.rating.count}{" "}
                      reviews)
                    </small>
                  )}
                </Col>
              </Row>
            </Card.Body>

            <Card.Footer className="bg-white">
              {/* ✅ Responsive button row: stacks on xs, inline on sm+ */}
              <div className="row g-2 g-sm-3">
                <div className="col-12 col-sm-auto">
                  <Button className="w-100" onClick={handleAdd}>
                    Add to Cart
                  </Button>
                </div>

                <div className="col-12 col-sm-auto">
                  <Button
                    className="w-100"
                    variant="outline-secondary"
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                  >
                    Edit Product
                  </Button>
                </div>

                <div className="col-12 col-sm-auto">
                  <Button
                    className="w-100"
                    variant="danger"
                    onClick={handleDelete}
                  >
                    Delete Product
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>

          <div className="text-center text-muted mt-3">AldoWebsite</div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;
