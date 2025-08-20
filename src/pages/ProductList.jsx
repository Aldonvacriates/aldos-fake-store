import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../hooks";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Stack from "react-bootstrap/Stack";
import { toast } from "react-toastify";

function ProductList() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All Categories");

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  // Fetch products & categories
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [prodRes, catRes] = await Promise.all([
          axios.get("https://fakestoreapi.com/products", {
            signal: controller.signal,
          }),
          axios.get("https://fakestoreapi.com/products/categories", {
            signal: controller.signal,
          }),
        ]);

        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setCategories([
          "All Categories",
          ...(Array.isArray(catRes.data) ? catRes.data : []),
        ]);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("Couldn’t load products. Please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      const matchesCat =
        selectedCat === "All Categories" || p.category === selectedCat;
      return matchesQuery && matchesCat;
    });
  }, [products, query, selectedCat]);

  const handleRetry = () => {
    // simple reload
    window.location.reload();
  };

  const addToCart = (product) => {
    try {
      // Use the cart context instead of localStorage directly
      addItem(product, 1);
      toast.success(`Added "${product.title}" to cart`);
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Could not add product to cart");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
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
          <Button
            variant="dark"
            onClick={handleRetry}
            style={{ backgroundColor: "#003366", borderColor: "#003366" }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Title */}
      <h2 className="text-center fw-bold mb-4">Our Products</h2>

      {/* Search + Category - Better mobile layout */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={8} lg={7}>
          <Form.Control
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control-lg"
          />
        </Col>
        <Col xs={12} md={4} lg={5}>
          <DropdownButton
            variant="outline-secondary"
            title={selectedCat}
            className="w-100"
            size="lg"
          >
            {categories.map((cat) => (
              <Dropdown.Item
                key={cat}
                active={selectedCat === cat}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>

      {/* Grid - Better responsive breakpoints */}
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3 g-md-4">
        {filtered.map(({ id, title, price, image }) => (
          <Col key={id}>
            <Card className="h-100 shadow-sm" style={{ borderRadius: 10 }}>
              <div
                className="ratio ratio-1x1 bg-light"
                style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              >
                <Card.Img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="object-fit-contain p-2 p-md-3"
                />
              </div>
              <Card.Body className="d-flex flex-column p-3">
                <div
                  className="mb-2 fw-semibold small"
                  title={title}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.3",
                    minHeight: "2.6em",
                  }}
                >
                  {title}
                </div>
                <div className="mb-3 fw-bold text-primary">
                  {currency.format(price)}
                </div>

                {/* Buttons - Improved mobile layout */}
                <Stack className="mt-auto" gap={2}>
                  <Button
                    as={Link}
                    to={`/products/${id}`}
                    variant="outline-primary"
                    className="w-100"
                    size="sm"
                    style={{ borderColor: "#003366", color: "#003366" }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    className="w-100"
                    size="sm"
                    onClick={() => addToCart({ id, title, price, image })}
                    style={{
                      backgroundColor: "#003366",
                      borderColor: "#003366",
                    }}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <div className="text-center text-muted mt-5">
          <p className="fs-5">No products match your filters.</p>
          <Button
            variant="outline-primary"
            onClick={() => {
              setQuery("");
              setSelectedCat("All Categories");
            }}
            style={{ borderColor: "#003366", color: "#003366" }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ProductList;
