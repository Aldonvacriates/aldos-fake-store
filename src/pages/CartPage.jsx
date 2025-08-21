import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useCart } from "../hooks";

/*
  CartPage.jsx
  - Displays the user's shopping cart.
  - Allows quantity updates, item removal, clearing the cart, and proceeding to checkout.
  - Uses cart context (useCart) for state and actions; currency formatting is handled locally.
  - Responsive layout: list of items on the left, order summary on the right (desktop).
*/

export default function CartPage() {
  // Destructure useful values and actions from the cart context
  const { items, cartTotal, cartCount, updateQty, removeItem, clearCart } =
    useCart();

  // safeCartCount: fall back to a computed count if cartCount is missing/invalid.
  // This guards against any transient state shape issues.
  const safeCartCount =
    typeof cartCount === "number"
      ? cartCount
      : (items || []).reduce((sum, it) => sum + (it.qty || 0), 0);

  // Currency formatter for consistent price display
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Empty cart UI: friendly message and CTA to browse products
  if (!items || items.length === 0) {
    return (
      <Container className="py-4">
        <Alert
          variant="info"
          className="d-flex justify-content-between align-items-center"
        >
          {/* Inform the user the cart is empty */}
          <div>Your cart is empty.</div>

          {/* CTA to go back to products - styled to match dark-blue theme */}
          <Button
            as={Link}
            to="/products"
            variant="primary"
            style={{ backgroundColor: "#003366", borderColor: "#003366" }}
          >
            Browse products
          </Button>
        </Alert>
      </Container>
    );
  }

  // Main cart UI when there are items
  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Left column: list of cart items */}
        <Col lg={8}>
          <ListGroup variant="flush" className="shadow-sm">
            {items.map((item) => (
              <ListGroup.Item key={item.id}>
                <Row className="align-items-center g-3">
                  {/* Product image */}
                  <Col xs={3} md={2}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fluid
                      rounded
                      style={{ maxHeight: 90, objectFit: "contain" }}
                    />
                  </Col>

                  {/* Title and unit price */}
                  <Col xs={9} md={5}>
                    <div className="fw-semibold">{item.title}</div>
                    <div className="text-muted">
                      {currency.format(item.price)}
                    </div>
                  </Col>

                  {/* Quantity control
                      - Uses numeric input for direct editing
                      - onChange parses the value and calls updateQty with a sane fallback
                      - You could replace this with +/- buttons for better mobile UX */}
                  <Col xs={7} md={3}>
                    <Form.Label className="text-muted small mb-1">
                      Qty
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        // Ensure quantity is at least 1
                        updateQty(item.id, isNaN(val) ? 1 : val);
                      }}
                    />
                  </Col>

                  {/* Line total and remove action */}
                  <Col xs={5} md={2} className="text-end">
                    <div className="mb-2 fw-semibold">
                      {currency.format(item.price * item.qty)}
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Right column: order summary and actions */}
        <Col lg={4}>
          {/* Small summary count shown above card */}
          <div className="mb-3 text-end">
            <span className="fw-semibold">{safeCartCount}</span>
          </div>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Order Summary</Card.Title>

              {/* Item count */}
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span className="fw-semibold">{cartCount}</span>
              </div>

              {/* Subtotal */}
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span className="fw-semibold">
                  {currency.format(cartTotal)}
                </span>
              </div>

              {/* Checkout button
                  - Navigates to /checkout where the payment flow is handled
                  - Styled to match the app's dark-blue primary color */}
              <Button
                as={Link}
                to="/checkout"
                variant="success"
                className="w-100 mb-2"
                style={{ backgroundColor: "#003366", borderColor: "#003366" }}
              >
                Checkout
              </Button>

              {/* Clear cart action */}
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
