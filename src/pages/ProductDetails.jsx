// ProductDetails.jsx
// Displays detailed information for a single product, including actions to add to cart, edit, or delete.

import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../hooks";
import { toast } from "react-toastify";

// Bootstrap components for layout and UI
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";

function ProductDetails() {
  // Access addItem from cart context
  const { addItem } = useCart();

  // Get product ID from URL params and navigation helper
  const { id } = useParams();
  const navigate = useNavigate();

  // State for product data, loading, and error
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation modal and deleting status
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Currency formatter for displaying price
  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  // Add product to cart and show toast notification
  const addToCart = (p) => {
    addItem(p, 1);
    toast.success("Added to cart");
  };

  // Fetch product details from API when component mounts or id changes
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          `https://fakestoreapi.com/products/${id}`,
          { signal: controller.signal }
        );
        setProduct(data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("Couldn’t load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    // Cleanup: abort fetch if component unmounts
    return () => controller.abort();
  }, [id]);

  // Handle product deletion with confirmation
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      navigate("/products"); // Redirect to product list after delete
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
      setShowDelete(false);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
        <span className="ms-2">Loading product…</span>
      </div>
    );
  }

  // Show error alert if fetch fails
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/products" variant="dark">
          Back to Products
        </Button>
      </Container>
    );
  }

  // Show message if no product is found
  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>No product found</h2>
        <Button as={Link} to="/products" variant="dark">
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Product card with image, details, and actions */}
      <Card className="shadow-sm mx-auto" style={{ maxWidth: 820 }}>
        <Card.Body>
          {/* Product title and price */}
          <Card.Title className="mb-2 h3 fw-bold">{product.title}</Card.Title>
          <div className="text-muted mb-3">
            {currency.format(product.price)}
          </div>

          <Row className="g-4">
            {/* Product image */}
            <Col md={5}>
              <div className="border rounded p-3 bg-light">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: 300,
                    objectFit: "contain",
                    width: "100%",
                  }}
                  loading="lazy"
                />
              </div>
            </Col>

            {/* Product details */}
            <Col md={7}>
              <p className="mb-2 text-muted">
                Category:{" "}
                <span className="text-capitalize">
                  <Badge bg="secondary">{product.category}</Badge>
                </span>
              </p>
              <p className="mb-3">{product.description}</p>
              <small className="text-muted">
                Rating: {product.rating?.rate} ({product.rating?.count} reviews)
              </small>
            </Col>
          </Row>
        </Card.Body>

        {/* Action buttons: Add to Cart, Edit, Delete */}
        <Card.Footer className="bg-white">
          <div className="row g-2">
            {/* Add to Cart button */}
            <div className="col-12">
              <Button
                className="w-100 py-2"
                variant="primary"
                onClick={() => addToCart(product)}
                style={{ backgroundColor: "#0b132b", borderColor: "#0b132b" }} // dark navy
              >
                Add to Cart
              </Button>
            </div>

            {/* Edit Product button */}
            <div className="col-12">
              <Button
                as={Link}
                to={`/edit-product/${product.id}`}
                variant="outline-secondary"
                className="w-100 py-2"
              >
                Edit Product
              </Button>
            </div>

            {/* Delete Product button */}
            <div className="col-12">
              <Button
                variant="danger"
                className="w-100 py-2"
                onClick={() => setShowDelete(true)}
                disabled={deleting}
                style={{ backgroundColor: "#e74b4b", borderColor: "#e74b4b" }} // red like screenshot
              >
                {deleting ? "Deleting…" : "Delete Product"}
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Footer/branding */}
      <div className="text-center text-muted mt-3">AldoWebsite</div>

      {/* Delete confirmation modal */}
      <Modal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action cannot be undone. This will attempt to delete the product.
          (Note: FakeStoreAPI does not persist deletions.)
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleting}
            style={{ backgroundColor: "#e74b4b", borderColor: "#e74b4b" }}
          >
            {deleting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Deleting…
              </>
            ) : (
              "Delete Product"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductDetails;
