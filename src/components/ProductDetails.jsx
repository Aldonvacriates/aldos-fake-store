import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {
            signal: controller.signal,
          }
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
        <Button
          as={Link}
          to="/"
          variant="success"
          style={{ backgroundColor: "#003366", borderColor: "#003366" }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>No product found</h2>
        <Button
          as={Link}
          to="/"
          variant="success"
          style={{ backgroundColor: "#003366", borderColor: "#003366" }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <div className="ratio ratio-1x1 bg-light">
          <Card.Img
            variant="top"
            src={product.image}
            alt={`${product.title} — product image`}
            className="object-fit-contain p-3"
            loading="lazy"
          />
        </div>
        <Card.Body>
          <Card.Title className="mb-3">{product.title}</Card.Title>
          <Card.Text>
            <strong>Category:</strong>{" "}
            <Badge bg="secondary">{product.category}</Badge>
          </Card.Text>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text className="fw-bold">
            {currency.format(product.price)}
          </Card.Text>

          <Button
            as={Link}
            to="/products"
            variant="success"
            style={{ backgroundColor: "#003366", borderColor: "#003366" }}
          >
            Back to Products
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetails;
