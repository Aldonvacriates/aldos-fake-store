/**
 * EditProduct.jsx
 *
 * Purpose:
 * - Load an existing product by id and display a form to edit it.
 * - Use ProductForm for the UI and updateProduct API for submission.
 * - Show loader while fetching, and success/error alerts after actions.
 *
 * Notes:
 * - This component is read-only until initial product data is loaded.
 * - FakeStoreAPI does not persist updates across server restarts/refreshes;
 *   success messages are informational for the demo only.
 * - Keep UX friendly for small screens: success/error alerts sit directly
 *   under the card header so they are visible without extra scrolling.
 */

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
  // Read the product id from the route params
  const { id } = useParams();

  // initial: form initial values (populated after fetch)
  const [initial, setInitial] = useState(null);
  // loading: true while fetching product data
  const [loading, setLoading] = useState(true);
  // submitting: true while sending update request
  const [submitting, setSubmitting] = useState(false);
  // success: success message to show in an alert (string)
  const [success, setSuccess] = useState("");
  // error: error message to show in an alert (string)
  const [error, setError] = useState("");

  /**
   * Effect: fetch product details when component mounts or id changes.
   * - Uses a `mounted` flag to avoid setting state on unmounted component.
   * - Populates `initial` with the shape expected by ProductForm.
   */
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getProduct(id)
      .then((response) => {
        if (!mounted) return;
        const data = response.data || {};

        // Map API fields to the ProductForm's expected initialValues
        setInitial({
          title: data.title ?? "",
          price: String(data.price ?? ""), // keep as string for controlled input
          description: data.description ?? "",
          category: data.category ?? "",
        });
      })
      .catch((err) => mounted && setError(err.message || "Failed to load"))
      .finally(() => mounted && setLoading(false));

    // Cleanup: ensure we don't set state after unmount
    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * handleSubmit(payload)
   * - Called by ProductForm when user submits the edited product.
   * - Shows submitting state, calls updateProduct API and sets success/error messages.
   * - Scrolls to top on success so the alert is visible on small screens.
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const res = await updateProduct(id, payload);

      // Show a friendly success message (note about FakeStoreAPI persistence)
      setSuccess(
        `Product updated! (ID: ${
          res?.data?.id || id
        }). Note: FakeStoreAPI won’t persist after refresh.`
      );

      // On small screens the alert may be offscreen — bring it into view
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  // While loading show the reusable Loader component
  if (loading) return <Loader label="Loading product..." />;

  // If there was an error and we don't have initial data, show an error state
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

  // Guard: if fetch returned but no product exists, show a not-found message
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

  // Main UI: form wrapped in a card with header, alerts, and footer note
  return (
    <Container
      className="py-3 px-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className="shadow-sm rounded-4 overflow-hidden">
            {/* Header: title and back button. On very small screens these stack vertically. */}
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

            {/* Alerts placed directly under header for visibility on small screens */}
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

            {/* Form body */}
            <Card.Body className="p-3 p-sm-4">
              <ProductForm
                initialValues={initial}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Update Product"
                // Note: ProductForm accepts initialValues and will call onSubmit(formData).
                // Parent handles the API and displays success/error alerts.
              />
            </Card.Body>
          </Card>

          {/* Small footer note / branding */}
          <div className="text-center text-muted small mt-3">AldoWebsite</div>
        </Col>
      </Row>
    </Container>
  );
}
