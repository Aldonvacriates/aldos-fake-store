import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      // Read existing cart from localStorage (array of { id, title, price, image, quantity })
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];

      // Find existing item and increment quantity, or add new item
      const idx = cart.findIndex((it) => it.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      // Persist updated cart
      localStorage.setItem("cart", JSON.stringify(cart));

      // Notify UI / other parts of the app (optional)
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));

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

      {/* Search + Category */}
      <Row className="g-3 mb-4 justify-content-center">
        <Col xs={12} md={8} lg={7}>
          <Form.Control
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <DropdownButton
            variant="outline-secondary"
            title={selectedCat}
            align="end"
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

      {/* Grid */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
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
                  className="object-fit-contain p-3"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="mb-2 fw-semibold text-truncate" title={title}>
                  {title}
                </div>
                <div className="mb-3 fw-bold">{currency.format(price)}</div>

                {/* Buttons like screenshot: View Details (light) above Add to Cart (dark) */}
                <Stack className="mt-auto" gap={2}>
                  <Button
                    as={Link}
                    to={`/products/${id}`}
                    variant="light"
                    className="w-100 border"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="dark"
                    className="w-100"
                    onClick={() => addToCart({ id, title, price, image })}
                    style={{
                      backgroundColor: "#0b1e33" /* close to your navy */,
                      borderColor: "#0b1e33",
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
          No products match your filters.
        </div>
      )}
    </Container>
  );
}

export default ProductList;
