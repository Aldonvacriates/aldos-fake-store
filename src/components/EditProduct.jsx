import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../components/Loader";
import ProductForm from "../components/ProductForm";
import { getProduct, updateProduct } from "../api/api";

export default function EditProduct() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProduct(id)
      .then((response) => {
        if (!mounted) return;
        const data = response.data || {};
        setInitial({
          title: data.title ?? "",
          price: String(data.price ?? ""),
          description: data.description ?? "",
          category: data.category ?? "",
        });
      })
      .catch((err) => mounted && setError(err.message || "Failed to load"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const res = await updateProduct(id, payload);
      setSuccess(
        `Product updated! (ID: ${
          res?.data?.id || id
        }). Note: FakeStoreAPI won’t persist after refresh.`
      );
      // Optional: scroll to top so the success alert is visible on small screens
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading product..." />;

  if (error && !initial) {
    return (
      <Container className="py-3 px-2">
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
        <Button as={Link} to="/products" variant="primary" className="w-100">
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!initial) {
    return (
      <Container className="py-3 px-2">
        <Alert variant="warning" className="mb-3">
          Product not found.
        </Alert>
        <Button as={Link} to="/products" variant="primary" className="w-100">
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container
      className="py-3 px-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className="shadow-sm rounded-4 overflow-hidden">
            {/* Header: stacks on XS, inline on SM+ */}
            <Card.Header className="bg-white">
              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
                <h1 className="h5 mb-0 text-truncate">Edit Product</h1>
                <Button
                  as={Link}
                  to={`/products/${id}`}
                  variant="outline-secondary"
                  className="w-100 w-sm-auto"
                >
                  Back to Product
                </Button>
              </div>
            </Card.Header>

            {/* Alerts right under header so they’re seen immediately on small screens */}
            {success && (
              <Alert
                variant="success"
                onClose={() => setSuccess("")}
                dismissible
                className="mb-0 rounded-0"
                aria-live="polite"
              >
                {success}
              </Alert>
            )}
            {error && (
              <Alert
                variant="danger"
                onClose={() => setError("")}
                dismissible
                className="mb-0 rounded-0"
                aria-live="assertive"
              >
                {error}
              </Alert>
            )}

            <Card.Body className="p-3 p-sm-4">
              {/* Form: full width on phone, centered on larger screens */}
              <ProductForm
                initialValues={initial}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Update Product"
                // If your ProductForm forwards props/classes to the submit button,
                // consider passing: submitButtonClassName="w-100 py-2"
              />
            </Card.Body>
          </Card>

          <div className="text-center text-muted small mt-3">AldoWebsite</div>
        </Col>
      </Row>
    </Container>
  );
}
