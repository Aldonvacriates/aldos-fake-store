import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify"; // optional, since you already mounted ToastContainer

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";

function ProductDetails() {
  const { addItem } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // TODO: Replace with your real cart context if you have one.
  const addToCart = (p) => {
    addItem(p, 1);
    toast.success("Added to cart"); // optional
  };

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

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
        console.error("Error fetching product details:", err);
        setError("Couldn’t load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      // FakeStoreAPI doesn't persist deletes; this just simulates success.
      navigate("/products");
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
      setShowDelete(false);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
        <span className="ms-2">Loading product…</span>
      </div>
    );
  }

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
      <Card className="shadow-sm mx-auto" style={{ maxWidth: 820 }}>
        <Card.Body>
          <Card.Title className="mb-2 h3 fw-bold">{product.title}</Card.Title>
          <div className="text-muted mb-3">
            {currency.format(product.price)}
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="border rounded p-3 bg-light">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid object-fit-contain"
                  style={{ maxHeight: 260 }}
                  loading="lazy"
                />
              </div>
            </Col>

            <Col md={8}>
              <p className="mb-2">
                <strong>Category:</strong>{" "}
                <Badge bg="secondary">{product.category}</Badge>
              </p>

              <p className="mb-3">{product.description}</p>

              <small className="text-muted">
                Rating: {product.rating?.rate} ({product.rating?.count} reviews)
              </small>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="bg-white">
          <Stack
            direction="horizontal"
            gap={2}
            className="justify-content-end flex-wrap"
          >
            <Button
              variant="primary"
              onClick={() => addToCart(product)}
              style={{ backgroundColor: "#003366", borderColor: "#003366" }}
            >
              Add to Cart
            </Button>

            <Button
              as={Link}
              to={`/edit-product/${product.id}`}
              variant="outline-secondary"
            >
              Edit Product
            </Button>

            <Button
              variant="danger"
              onClick={() => setShowDelete(true)}
              disabled={deleting}
              style={{ backgroundColor: "#ac141bff", borderColor: "#a70334ff" }}
            >
              {deleting ? "Deleting…" : "Delete Product"}
            </Button>
          </Stack>
        </Card.Footer>
      </Card>

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
            style={{ backgroundColor: "#ac141bff", borderColor: "#a70334ff" }}
          >
            {deleting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />{" "}
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
