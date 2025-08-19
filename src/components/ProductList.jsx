import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  // Fetch products on mount with cancellation support
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get("https://fakestoreapi.com/products", {
          signal: controller.signal,
        });
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (axios.isCancel(err)) return; // ignore aborted calls
        console.error("Error fetching products:", err);
        setError("Couldn’t load products. Please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleRetry = () => {
    // simple retry by re-triggering the effect via a state toggle
    setLoading(true);
    setError(null);
    // Re-run fetch by mimicking mount: create a new effect by updating a dummy key would be overkill
    // so we call the same logic inline
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await axios.get("https://fakestoreapi.com/products", {
          signal: controller.signal,
        });
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Error fetching products:", err);
        setError("Couldn’t load products. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        role="status"
        aria-live="polite"
      >
        <Spinner animation="border" />
        <span className="ms-2">Loading products…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <div>{error}</div>
          <Button variant="outline-success" onClick={handleRetry}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!products.length) {
    return (
      <Container className="py-5 text-center">
        <h1 className="h3 mb-3">Products</h1>
        <p className="text-muted mb-0">No products found.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <header className="d-flex justify-content-between align-items-end mb-3">
        <h1 className="h3 m-0">Products</h1>
        <Badge
          bg="secondary"
          pill
          aria-label={`Total products: ${products.length}`}
        >
          {products.length}
        </Badge>
      </header>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {products.map((product) => {
          const { id, title, price, image, rating } = product;
          const subtitle = rating?.count ? `${rating.count} reviews` : null;
          const rate = rating?.rate ? `${rating.rate.toFixed(1)}★` : null;

          return (
            <Col key={id}>
              <Card className="h-100 shadow-sm">
                <div className="ratio ratio-1x1 bg-light">
                  {/* Keep alt short, purpose-focused; lazy-load for perf */}
                  <Card.Img
                    src={image}
                    alt={`${title} — product image`}
                    loading="lazy"
                    className="object-fit-contain p-3"
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6 text-truncate" title={title}>
                    {title}
                  </Card.Title>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fw-semibold">
                      {currency.format(price)}
                    </span>
                    {rate && (
                      <Badge bg="success" title="Average rating">
                        {rate}
                      </Badge>
                    )}
                    {subtitle && (
                      <small className="text-muted">{subtitle}</small>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to={`/products/${id}`}
                      variant="success"
                      className="w-100"
                      aria-label={`View details for ${title}`}
                    >
                      View details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default ProductList;
